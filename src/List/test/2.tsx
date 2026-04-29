import { Empty } from 'antd';
import React, {
  CSSProperties,
  Key,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './2.module.less';

export interface VirtualListProps<T extends Record<string, any>> {
  dataSource: T[];
  height: number;
  itemHeight: number;
  itemKey: keyof T;
  renderItem: (item: T, index: number) => ReactNode;
  style?: CSSProperties;
}

/** 这版先做定高的虚拟滚动 */
const VirtualList = memo(
  <T extends Record<string, any>>(props: VirtualListProps<T>) => {
    const { dataSource, height, itemHeight, itemKey, renderItem, style } =
      props;
    const [scrollTop, setScrollTop] = useState(0);
    const rafIdRef = useRef<number | null>(null);

    const overscan = 5;
    const len = dataSource.length;
    const totalHeight = len * itemHeight;
    const safeScrollTop = Math.min(
      Math.max(0, scrollTop),
      Math.max(0, totalHeight - height),
    );

    const rawStart = Math.floor(safeScrollTop / itemHeight);
    const rawEnd = Math.ceil((safeScrollTop + height) / itemHeight) - 1;
    const start = Math.max(rawStart - overscan, 0);
    const end = Math.min(rawEnd + overscan, len - 1);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const nextScrollTop = event.currentTarget.scrollTop;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        setScrollTop(nextScrollTop);
        rafIdRef.current = null;
      });
    }, []);

    useEffect(() => {
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, []);

    const renderItems = useCallback(() => {
      if (!len) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      }
      if (end < start) {
        return [];
      }
      return dataSource.slice(start, end + 1).map((item, offset) => {
        const index = start + offset;
        return (
          <div key={item?.[itemKey] as Key} style={{ height: itemHeight }}>
            {renderItem(item, index)}
          </div>
        );
      });
    }, [end, start, renderItem, dataSource, itemKey, itemHeight]);

    if (itemHeight <= 0) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error('itemHeight must be greater than 0');
      }
      return null;
    }

    return (
      <div
        className={styles.list}
        style={{ ...style, height }}
        onScroll={handleScroll}
      >
        <div style={{ height: len * itemHeight }}>
          <div style={{ transform: `translateY(${start * itemHeight}px)` }}>
            {renderItems()}
          </div>
        </div>
      </div>
    );
  },
) as <T extends Record<string, any>>(
  props: VirtualListProps<T>,
) => React.ReactElement;

export default VirtualList;
