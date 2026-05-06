import { Empty } from 'antd';
import classNames from 'classnames';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import type { CSSProperties, Key, ReactNode } from 'react';
import type { ListChildComponentProps, ListOnScrollProps } from 'react-window';
import { areEqual, FixedSizeList as List } from 'react-window';

import { useRefFunction } from '../hooks/useRefFunction';

type VirtualListItemKey<T> = keyof T | ((item: T, index: number) => Key);
type VirtualListItemClassName<T> =
  | string
  | ((item: T, index: number) => string | undefined);

type VirtualListItemData<T> = {
  dataSource: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemClassName: (item: T, index: number) => string | undefined;
};

type ScrollAlign = 'auto' | 'smart' | 'center' | 'end' | 'start';

export interface FixedVirtualListRef {
  scrollToTop: () => void;
  scrollToItem: (index: number, align?: ScrollAlign) => void;
  scrollToKey: (key: Key, align?: ScrollAlign) => void;
}

export interface FixedVirtualListProps<T> {
  /** 列表数据 */
  dataSource: T[];
  /** 可视区域高度 */
  height: number;
  /** 单项高度，10w 级场景建议固定高度 */
  itemHeight: number;
  /** 单项渲染函数 */
  renderItem: (item: T, index: number) => ReactNode;
  /** 列表宽度，默认占满容器 */
  width?: number | string;
  /** 预渲染条数，滚动更平滑 */
  overscanCount?: number;
  /** 容器类名 */
  className?: string;
  /** 容器样式 */
  style?: CSSProperties;
  /** 列表项类名 */
  itemClassName?: VirtualListItemClassName<T>;
  /** 列表项 key */
  itemKey?: VirtualListItemKey<T>;
  /** 空数据展示 */
  emptyRender?: ReactNode;
  /** 滚动事件 */
  onScroll?: (props: ListOnScrollProps) => void;
}

const DEFAULT_WIDTH = '100%';
const DEFAULT_OVERSCAN_COUNT = 6;

const FixedVirtualListItem = memo(
  ({
    index,
    style,
    data,
  }: ListChildComponentProps<VirtualListItemData<any>>) => {
    const item = data.dataSource[index];

    return (
      <div
        className={classNames(data.getItemClassName(item, index))}
        style={{
          ...style,
          boxSizing: 'border-box',
        }}
      >
        {data.renderItem(item, index)}
      </div>
    );
  },
  areEqual,
);

const FixedVirtualListInner = <T extends Record<PropertyKey, any>>(
  props: FixedVirtualListProps<T>,
  ref: React.Ref<FixedVirtualListRef>,
) => {
  const {
    dataSource,
    height,
    itemHeight,
    renderItem,
    width = DEFAULT_WIDTH,
    overscanCount = DEFAULT_OVERSCAN_COUNT,
    className,
    style,
    itemClassName,
    itemKey,
    emptyRender,
    onScroll,
  } = props;

  const listRef = useRef<List>(null);
  const keyIndexMapRef = useRef<Map<Key, number> | null>(null);

  const getItemClassName = useCallback(
    (item: T, index: number) => {
      if (typeof itemClassName === 'function') {
        return itemClassName(item, index);
      }

      return itemClassName;
    },
    [itemClassName],
  );

  const getItemKeyRef = useRefFunction(
    (index: number, itemData: VirtualListItemData<T>) => {
      const item = itemData.dataSource[index];

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
    },
  );

  const handleScroll = useRefFunction((scrollProps: ListOnScrollProps) => {
    onScroll?.(scrollProps);
  });

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

  const itemData = useMemo<VirtualListItemData<T>>(
    () => ({
      dataSource,
      renderItem,
      getItemClassName,
    }),
    [dataSource, renderItem, getItemClassName],
  );

  useEffect(() => {
    keyIndexMapRef.current = null;
  }, [dataSource, itemKey]);

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
      itemCount={dataSource.length}
      itemData={itemData}
      itemKey={getItemKeyRef}
      itemSize={itemHeight}
      overscanCount={overscanCount}
      width={width}
      onScroll={onScroll ? handleScroll : undefined}
    >
      {FixedVirtualListItem}
    </List>
  );
};

const FixedVirtualList = forwardRef(FixedVirtualListInner) as <
  T extends Record<PropertyKey, any>,
>(
  props: FixedVirtualListProps<T> & {
    ref?: React.Ref<FixedVirtualListRef>;
  },
) => React.ReactElement;

export default memo(FixedVirtualList) as typeof FixedVirtualList;
