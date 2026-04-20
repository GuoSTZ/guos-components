import { Empty } from 'antd';
import React, {
  CSSProperties,
  HTMLAttributes,
  Key,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../index.module.less';
import { ScrollAlign } from '../utils';

type ItemKeyGetter<T> = keyof T | ((item: T, index: number) => Key);

export interface ListRef {
  scrollTo: (scrollTop: number) => void;
  scrollToIndex: (index: number, align?: ScrollAlign) => void;
  scrollToKey: (key: Key, align?: ScrollAlign) => void;
  getScrollTop: () => number;
}

export interface ListScrollInfo {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  start: number;
  end: number;
}

export interface ListProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onScroll'> {
  dataSource: T[];
  height: number;
  itemHeight?: number;
  overscan?: number;
  itemKey?: ItemKeyGetter<T>;
  renderItem: (item: T, index: number) => ReactNode;
  empty?: ReactNode;
  itemStyle?: CSSProperties | ((item: T, index: number) => CSSProperties);
  onScroll?: (info: ListScrollInfo) => void;
}

const ListComponent = <T extends Record<string, any>>(
  props: ListProps<T>,
  ref: React.Ref<ListRef>,
) => {
  const {
    dataSource,
    height,
    itemHeight = 48,
    overscan = 10,
    itemKey = 'key' as keyof T,
    renderItem,
    empty,
    itemStyle,
    className,
    style,
    onScroll,
    ...restProps
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 最简固定高度虚拟滚动：只根据 scrollTop 计算可视窗口。
  const count = dataSource.length;
  const totalHeight = count * itemHeight;
  const getRangeByScrollTop = useCallback(
    (nextScrollTop: number) => {
      if (!count) {
        return {
          visibleStart: 0,
          visibleEnd: -1,
          start: 0,
          end: -1,
        };
      }

      const safeScrollTop = Math.max(0, nextScrollTop);
      const visibleStart = Math.min(
        count - 1,
        Math.max(0, Math.floor(safeScrollTop / itemHeight)),
      );
      // 使用像素边界计算可视结束项，避免快速滚动时末项少算一位。
      const visibleEnd = Math.min(
        count - 1,
        Math.max(
          visibleStart,
          Math.floor((safeScrollTop + Math.max(1, height) - 1) / itemHeight),
        ),
      );

      return {
        visibleStart,
        visibleEnd,
        start: Math.max(0, visibleStart - overscan),
        end: Math.min(count - 1, visibleEnd + overscan),
      };
    },
    [count, height, itemHeight, overscan],
  );
  const range = getRangeByScrollTop(scrollTop);
  const start = range.start;
  const end = range.end;

  // 为 scrollToKey 提供 O(1) 索引查找。
  const keyIndexMap = useMemo(() => {
    const map = new Map<Key, number>();
    dataSource.forEach((item, index) => {
      const key =
        typeof itemKey === 'function'
          ? itemKey(item, index)
          : (item?.[itemKey] as Key) ?? index;
      map.set(key, index);
    });
    return map;
  }, [dataSource, itemKey]);

  const emitScrollInfo = useCallback(
    (nextScrollTop: number) => {
      if (!containerRef.current) {
        return;
      }
      const nextRange = getRangeByScrollTop(nextScrollTop);

      onScroll?.({
        scrollTop: nextScrollTop,
        scrollHeight: containerRef.current.scrollHeight,
        clientHeight: containerRef.current.clientHeight,
        start: nextRange.visibleStart,
        end: nextRange.visibleEnd,
      });
    },
    [getRangeByScrollTop, onScroll],
  );

  const scrollTo = useCallback(
    (nextScrollTop: number) => {
      if (!containerRef.current) {
        return;
      }

      const maxScrollTop = Math.max(0, totalHeight - height);
      const safeScrollTop = Math.max(0, Math.min(nextScrollTop, maxScrollTop));

      containerRef.current.scrollTop = safeScrollTop;
      setScrollTop(safeScrollTop);
      emitScrollInfo(safeScrollTop);
    },
    [emitScrollInfo, height, totalHeight],
  );

  const scrollToIndex = useCallback(
    (index: number, align: ScrollAlign = 'auto') => {
      if (!count) {
        return;
      }

      const safeIndex = Math.max(0, Math.min(index, count - 1));
      const itemTop = safeIndex * itemHeight;
      const itemBottom = itemTop + itemHeight;
      const currentTop = containerRef.current?.scrollTop || 0;
      const currentBottom = currentTop + height;

      if (align === 'start') {
        scrollTo(itemTop);
        return;
      }

      if (align === 'center') {
        scrollTo(itemTop - (height - itemHeight) / 2);
        return;
      }

      if (align === 'end') {
        scrollTo(itemBottom - height);
        return;
      }

      // auto：仅在目标项不在可视区时滚动。
      if (itemTop < currentTop) {
        scrollTo(itemTop);
        return;
      }

      if (itemBottom > currentBottom) {
        scrollTo(itemBottom - height);
      }
    },
    [count, height, itemHeight, scrollTo],
  );

  const scrollToKey = useCallback(
    (key: Key, align: ScrollAlign = 'auto') => {
      const index = keyIndexMap.get(key);
      if (typeof index === 'number') {
        scrollToIndex(index, align);
      }
    },
    [keyIndexMap, scrollToIndex],
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollTo,
      scrollToIndex,
      scrollToKey,
      getScrollTop: () => containerRef.current?.scrollTop || 0,
    }),
    [scrollTo, scrollToIndex, scrollToKey],
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const nextScrollTop = event.currentTarget.scrollTop;
      setScrollTop(nextScrollTop);
      emitScrollInfo(nextScrollTop);
    },
    [emitScrollInfo],
  );

  // 仅渲染窗口区间的数据项，减少挂载节点数量。
  const renderedItems = useMemo(() => {
    if (end < start) {
      return [];
    }

    return dataSource.slice(start, end + 1).map((item, offset) => {
      const index = start + offset;
      const key =
        typeof itemKey === 'function'
          ? itemKey(item, index)
          : (item?.[itemKey] as Key) ?? index;
      const resolvedItemStyle =
        typeof itemStyle === 'function' ? itemStyle(item, index) : itemStyle;

      return (
        <div
          key={key}
          className={styles['list-item']}
          style={{
            top: index * itemHeight,
            height: itemHeight,
            ...resolvedItemStyle,
          }}
        >
          {renderItem(item, index)}
        </div>
      );
    });
  }, [dataSource, end, itemHeight, itemKey, itemStyle, renderItem, start]);

  if (!count) {
    return (
      <div
        {...restProps}
        className={className ? `${styles.list} ${className}` : styles.list}
        style={{ height, ...style }}
      >
        <div className={styles['list-empty']}>
          {empty || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      </div>
    );
  }

  return (
    <div
      {...restProps}
      ref={containerRef}
      className={className ? `${styles.list} ${className}` : styles.list}
      style={{ height, ...style }}
      onScroll={handleScroll}
    >
      {/* 幽灵容器撑开总高度，子项通过 absolute + top 定位。 */}
      <div className={styles['list-phantom']} style={{ height: totalHeight }}>
        {renderedItems}
      </div>
    </div>
  );
};

const List = memo(forwardRef(ListComponent)) as <T extends Record<string, any>>(
  props: ListProps<T> & { ref?: React.Ref<ListRef> },
) => React.ReactElement;

export default List;
