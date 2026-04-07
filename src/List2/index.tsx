import React, {
  CSSProperties,
  ReactNode,
  UIEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './index.module.less';

const DEFAULT_OVERSCAN = 2;

type ScrollAlign = 'start' | 'center' | 'end';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export interface List2VisibleRange {
  start: number;
  end: number;
}

export interface List2Ref {
  scrollToIndex: (index: number, align?: ScrollAlign) => void;
  scrollToTop: () => void;
}

export interface List2Props<T> {
  dataSource?: T[];
  height: number;
  itemHeight: number;
  overscan?: number;
  className?: string;
  style?: CSSProperties;
  itemKey?: keyof T | ((item: T, index: number) => React.Key);
  renderItem: (item: T, index: number) => ReactNode;
  emptyContent?: ReactNode;
  onScroll?: (scrollTop: number) => void;
  onVisibleRangeChange?: (range: List2VisibleRange) => void;
}

const List2Inner = <T,>(props: List2Props<T>, ref: React.Ref<List2Ref>) => {
  const {
    dataSource = [],
    height,
    itemHeight,
    overscan = DEFAULT_OVERSCAN,
    className,
    style,
    itemKey,
    renderItem,
    emptyContent,
    onScroll,
    onVisibleRangeChange,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const safeHeight = Math.max(height, 0);
  const safeItemHeight = Math.max(itemHeight, 1);
  const safeOverscan = Math.max(overscan, 0);
  const totalHeight = dataSource.length * safeItemHeight;
  const maxScrollTop = Math.max(totalHeight - safeHeight, 0);
  const visibleCount =
    safeHeight === 0 ? 0 : Math.ceil(safeHeight / safeItemHeight);
  const lastDataIndex = Math.max(dataSource.length - 1, 0);
  const hasData = dataSource.length > 0 && visibleCount > 0;

  /**
   * 真实可视区的起止索引。
   * 这组索引只代表当前 viewport 里肉眼能看到的项，不包含 overscan。
   */
  const visibleStartIndex = hasData
    ? clamp(Math.floor(scrollTop / safeItemHeight), 0, lastDataIndex)
    : 0;
  const visibleEndIndex = hasData
    ? clamp(visibleStartIndex + visibleCount - 1, 0, lastDataIndex)
    : 0;

  /**
   * 渲染区间会在真实可视区前后多补一点数据。
   * 这样滚动时不会因为临界点切换而出现明显白屏。
   */
  const renderStartIndex = hasData
    ? clamp(visibleStartIndex - safeOverscan, 0, lastDataIndex)
    : 0;
  const renderEndIndex = hasData
    ? Math.min(visibleEndIndex + safeOverscan + 1, dataSource.length)
    : 0;

  /**
   * 占位容器负责撑开完整列表高度。
   * 真正渲染的节点只会整体平移到 renderStartIndex 对应的位置。
   */
  const offsetY = renderStartIndex * safeItemHeight;

  const visibleItems = useMemo(() => {
    return dataSource.slice(renderStartIndex, renderEndIndex);
  }, [dataSource, renderEndIndex, renderStartIndex]);

  const scrollTo = useCallback(
    (nextScrollTop: number) => {
      const targetScrollTop = clamp(nextScrollTop, 0, maxScrollTop);

      if (containerRef.current) {
        containerRef.current.scrollTop = targetScrollTop;
      }

      setScrollTop(targetScrollTop);
    },
    [maxScrollTop],
  );

  const resolveItemKey = useCallback(
    (item: T, index: number) => {
      if (typeof itemKey === 'function') {
        return itemKey(item, index);
      }

      if (itemKey) {
        const currentKey = item[itemKey];

        if (typeof currentKey === 'string' || typeof currentKey === 'number') {
          return currentKey;
        }
      }

      return index;
    },
    [itemKey],
  );

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const nextScrollTop = event.currentTarget.scrollTop;
      setScrollTop(nextScrollTop);
      onScroll?.(nextScrollTop);
    },
    [onScroll],
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () => {
        scrollTo(0);
      },
      scrollToIndex: (index: number, align: ScrollAlign = 'start') => {
        if (dataSource.length === 0) {
          return;
        }

        const safeIndex = clamp(index, 0, dataSource.length - 1);
        const itemTop = safeIndex * safeItemHeight;

        let nextScrollTop = itemTop;

        if (align === 'center') {
          nextScrollTop = itemTop - safeHeight / 2 + safeItemHeight / 2;
        }

        if (align === 'end') {
          nextScrollTop = itemTop - safeHeight + safeItemHeight;
        }

        scrollTo(nextScrollTop);
      },
    }),
    [dataSource.length, safeHeight, safeItemHeight, scrollTo],
  );

  useEffect(() => {
    // 数据量突然变少时，当前 scrollTop 可能已经超出最大滚动范围，这里需要兜底纠正。
    if (scrollTop > maxScrollTop) {
      scrollTo(maxScrollTop);
    }
  }, [maxScrollTop, scrollTo, scrollTop]);

  useEffect(() => {
    if (!hasData) {
      return;
    }

    onVisibleRangeChange?.({
      start: visibleStartIndex,
      end: visibleEndIndex,
    });
  }, [hasData, onVisibleRangeChange, visibleEndIndex, visibleStartIndex]);

  return (
    <div
      ref={containerRef}
      className={[styles['virtual-list'], className].filter(Boolean).join(' ')}
      style={{ ...style, height: safeHeight }}
      onScroll={handleScroll}
    >
      {dataSource.length === 0 ? (
        <div className={styles['virtual-list-empty']}>
          {emptyContent ?? '暂无数据'}
        </div>
      ) : (
        <div
          className={styles['virtual-list-phantom']}
          style={{ height: totalHeight }}
        >
          <div
            className={styles['virtual-list-content']}
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleItems.map((item, offsetIndex) => {
              const itemIndex = renderStartIndex + offsetIndex;

              return (
                <div
                  key={resolveItemKey(item, itemIndex)}
                  className={styles['virtual-list-item']}
                  style={{ height: safeItemHeight }}
                >
                  {renderItem(item, itemIndex)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const List2 = forwardRef(List2Inner) as <T>(
  props: List2Props<T> & { ref?: React.Ref<List2Ref> },
) => React.ReactElement;

export default List2;
