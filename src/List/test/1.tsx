import { Empty } from 'antd';
import React, {
  CSSProperties,
  HTMLAttributes,
  Key,
  ReactNode,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../index.module.less';

type ItemKeyGetter<T> = keyof T | ((item: T, index: number) => Key);

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

const ListComponent = <T extends Record<string, any>>(props: ListProps<T>) => {
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

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const nextScrollTop = event.currentTarget.scrollTop;
      setScrollTop(nextScrollTop);
      emitScrollInfo(nextScrollTop);
    },
    [emitScrollInfo],
  );

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
      <div className={styles['list-phantom']} style={{ height: totalHeight }}>
        {renderedItems}
      </div>
    </div>
  );
};

const List = memo(ListComponent) as <T extends Record<string, any>>(
  props: ListProps<T>,
) => React.ReactElement;

export default List;
