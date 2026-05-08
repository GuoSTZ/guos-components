import { Empty } from 'antd';
import classNames from 'classnames';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import type { CSSProperties, Key, ReactNode } from 'react';
import type { ListChildComponentProps, ListOnScrollProps } from 'react-window';
import { areEqual, VariableSizeList as List } from 'react-window';

import { useRefFunction } from '../_utils/useRefFunction';

type VariableItemKey<T> = keyof T | ((item: T, index: number) => Key);
type VariableItemClassName<T> =
  | string
  | ((item: T, index: number) => string | undefined);

type VariableRowData<T> = {
  dataSource: T[];
  renderItem: (item: T, index: number) => ReactNode;
  setSize: (index: number, size: number) => void;
  getItemClassName: (item: T, index: number) => string | undefined;
};

type ScrollAlign = 'auto' | 'smart' | 'center' | 'end' | 'start';

export interface VariableVirtualListRef {
  scrollToTop: () => void;
  scrollToItem: (index: number, align?: ScrollAlign) => void;
  scrollToKey: (key: Key, align?: ScrollAlign) => void;
}

export interface VariableVirtualListProps<T> {
  /** 列表数据 */
  dataSource: T[];
  /** 可视区域高度 */
  height: number;
  /** 列表宽度，默认占满容器 */
  width?: number | string;
  /** 预估项高度 */
  estimatedItemSize?: number;
  /** 预渲染条数 */
  overscanCount?: number;
  /** 容器类名 */
  className?: string;
  /** 容器样式 */
  style?: CSSProperties;
  /** 列表项类名 */
  itemClassName?: VariableItemClassName<T>;
  /** 列表项 key */
  itemKey?: VariableItemKey<T>;
  /** 空数据展示 */
  emptyRender?: ReactNode;
  /** 单项渲染函数 */
  renderItem: (item: T, index: number) => ReactNode;
  /** 滚动事件 */
  onScroll?: (props: ListOnScrollProps) => void;
}

const DEFAULT_WIDTH = '100%';
const DEFAULT_ESTIMATED_ITEM_SIZE = 64;
const DEFAULT_OVERSCAN_COUNT = 6;

const VariableRow = memo(
  ({ index, style, data }: ListChildComponentProps<VariableRowData<any>>) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const item = data.dataSource[index];

    useLayoutEffect(() => {
      const element = itemRef.current;

      if (!element) {
        return;
      }

      const updateSize = () => {
        const nextHeight = Math.ceil(element.getBoundingClientRect().height);
        data.setSize(index, nextHeight);
      };

      updateSize();

      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      const resizeObserver = new ResizeObserver(() => {
        updateSize();
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, [data, index]);

    return (
      <div
        className={classNames(data.getItemClassName(item, index))}
        style={style}
      >
        <div ref={itemRef}>{data.renderItem(item, index)}</div>
      </div>
    );
  },
  areEqual,
);

const VariableVirtualListInner = <T extends Record<PropertyKey, any>>(
  props: VariableVirtualListProps<T>,
  ref: React.Ref<VariableVirtualListRef>,
) => {
  const {
    dataSource,
    height,
    width = DEFAULT_WIDTH,
    estimatedItemSize = DEFAULT_ESTIMATED_ITEM_SIZE,
    overscanCount = DEFAULT_OVERSCAN_COUNT,
    className,
    style,
    itemClassName,
    itemKey,
    emptyRender,
    renderItem,
    onScroll,
  } = props;

  const listRef = useRef<List>(null);
  const keyIndexMapRef = useRef<Map<Key, number> | null>(null);
  const sizeCacheRef = useRef<Map<Key, number>>(new Map());
  const dataSourceRef = useRef(dataSource);
  const resetIndexRef = useRef<number | null>(null);
  const resetFrameRef = useRef<number | null>(null);

  dataSourceRef.current = dataSource;

  const getItemClassName = useCallback(
    (item: T, index: number) => {
      if (typeof itemClassName === 'function') {
        return itemClassName(item, index);
      }

      return itemClassName;
    },
    [itemClassName],
  );
  const resolveItemKey = useRefFunction((item: T, index: number) => {
    if (typeof itemKey === 'function') {
      return itemKey(item, index);
    }

    if (itemKey) {
      const currentKey = item?.[itemKey];
      if (currentKey !== undefined && currentKey !== null) {
        return currentKey as Key;
      }
    }

    return index;
  });
  const handleScroll = useRefFunction((scrollProps: ListOnScrollProps) => {
    onScroll?.(scrollProps);
  });
  const getKeyIndexMap = useRefFunction(() => {
    if (keyIndexMapRef.current) {
      return keyIndexMapRef.current;
    }

    const nextMap = new Map<Key, number>();

    dataSource.forEach((item, index) => {
      nextMap.set(resolveItemKey(item, index), index);
    });

    keyIndexMapRef.current = nextMap;

    return nextMap;
  });

  const scheduleResetAfterIndex = useCallback((index: number) => {
    if (resetIndexRef.current === null) {
      resetIndexRef.current = index;
    } else {
      resetIndexRef.current = Math.min(resetIndexRef.current, index);
    }

    if (resetFrameRef.current !== null) {
      return;
    }

    resetFrameRef.current = window.requestAnimationFrame(() => {
      const nextResetIndex = resetIndexRef.current ?? 0;

      resetIndexRef.current = null;
      resetFrameRef.current = null;

      listRef.current?.resetAfterIndex(nextResetIndex);
    });
  }, []);

  useEffect(() => {
    keyIndexMapRef.current = null;

    return () => {
      if (resetFrameRef.current !== null) {
        window.cancelAnimationFrame(resetFrameRef.current);
      }
    };
  }, [dataSource, itemKey]);

  const getItemSize = useCallback(
    (index: number) => {
      const item = dataSource[index];

      if (!item) {
        return estimatedItemSize;
      }

      const cacheKey = resolveItemKey(item, index);

      return sizeCacheRef.current.get(cacheKey) ?? estimatedItemSize;
    },
    [dataSource, estimatedItemSize, resolveItemKey],
  );

  const setSize = useRefFunction((index: number, size: number) => {
    const item = dataSourceRef.current[index];

    if (!item) {
      return;
    }

    const cacheKey = resolveItemKey(item, index);
    const previousSize = sizeCacheRef.current.get(cacheKey);

    if (previousSize === size) {
      return;
    }

    sizeCacheRef.current.set(cacheKey, size);
    scheduleResetAfterIndex(index);
  });

  const itemData = useMemo<VariableRowData<T>>(
    () => ({
      dataSource,
      renderItem,
      setSize,
      getItemClassName,
    }),
    [dataSource, renderItem, setSize, getItemClassName],
  );

  const getItemKey = useCallback(
    (index: number, itemDataSource: VariableRowData<T>) => {
      const item = itemDataSource.dataSource[index];

      return resolveItemKey(item, index);
    },
    [resolveItemKey],
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () => {
        listRef.current?.scrollTo(0);
      },
      scrollToItem: (index: number, align: ScrollAlign = 'auto') => {
        listRef.current?.scrollToItem(index, align);
      },
      scrollToKey: (key: Key, align: ScrollAlign = 'auto') => {
        const index = getKeyIndexMap().get(key);

        if (index === undefined) {
          return;
        }

        listRef.current?.scrollToItem(index, align);
      },
    }),
    [getKeyIndexMap],
  );

  if (dataSource.length === 0) {
    return (
      <div
        className={className}
        style={{
          ...style,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {emptyRender ?? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
    );
  }

  return (
    <List
      ref={listRef}
      className={className}
      style={style}
      height={height}
      width={width}
      itemCount={dataSource.length}
      itemData={itemData}
      itemKey={getItemKey}
      itemSize={getItemSize}
      estimatedItemSize={estimatedItemSize}
      overscanCount={overscanCount}
      onScroll={onScroll ? handleScroll : undefined}
    >
      {VariableRow}
    </List>
  );
};

const VariableVirtualList = forwardRef(VariableVirtualListInner) as <
  T extends Record<PropertyKey, any>,
>(
  props: VariableVirtualListProps<T> & {
    ref?: React.Ref<VariableVirtualListRef>;
  },
) => React.ReactElement;

export default memo(VariableVirtualList) as typeof VariableVirtualList;
