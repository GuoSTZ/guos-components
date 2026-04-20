import { Empty } from 'antd';
import React, {
  CSSProperties,
  HTMLAttributes,
  Key,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './index.module.less';
import {
  ScrollAlign,
  createVirtualMeasurements,
  getAdaptiveOverscan,
  getScrollTopByIndex,
  getVisibleRange,
} from './utils';

type ItemKeyGetter<T> = keyof T | ((item: T, index: number) => Key);

/** 对外暴露的列表实例方法 */
export interface ListRef {
  /** 滚动到指定 scrollTop */
  scrollTo: (scrollTop: number) => void;
  /** 按索引滚动到目标项 */
  scrollToIndex: (index: number, align?: ScrollAlign) => void;
  /** 按业务主键滚动到目标项 */
  scrollToKey: (key: Key, align?: ScrollAlign) => void;
  /** 获取当前 scrollTop */
  getScrollTop: () => number;
}

/** 滚动事件回调给业务侧的可视信息 */
export interface ListScrollInfo {
  /** 当前滚动位置 */
  scrollTop: number;
  /** 容器总滚动高度 */
  scrollHeight: number;
  /** 容器可视高度 */
  clientHeight: number;
  /** 当前真实可视区起始索引 */
  start: number;
  /** 当前真实可视区结束索引 */
  end: number;
}

/** 虚拟列表组件参数 */
export interface ListProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onScroll'> {
  /** 列表数据源 */
  dataSource: T[];
  /** 容器高度，单位 px */
  height: number;
  /** 列表项估算高度，未测量项用它参与布局 */
  itemHeight?: number;
  /** 可视区前后额外渲染项数量 */
  overscan?: number;
  /** 列表项主键字段或主键计算函数 */
  itemKey?: ItemKeyGetter<T>;
  /** 每一项的渲染函数 */
  renderItem: (item: T, index: number) => ReactNode;
  /** 空状态内容 */
  empty?: ReactNode;
  /** 列表项样式或样式计算函数 */
  itemStyle?: CSSProperties | ((item: T, index: number) => CSSProperties);
  /** 滚动回调，返回真实可视区间 */
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
    overscan = 4,
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
  /** 记录每一项的真实高度，未测量过的项回退到 itemHeight */
  const measuredHeightsRef = useRef(new Map<number, number>());
  /** 缓存最近一次可视区，供高度回填时修正滚动位置 */
  const visibleRangeRef = useRef({
    start: 0,
    end: -1,
    offset: 0,
    visibleStart: 0,
    visibleEnd: -1,
    totalHeight: 0,
  });
  const [measurementVersion, setMeasurementVersion] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [activeOverscan, setActiveOverscan] = useState(overscan);
  /** 记录最近一次滚动事件位置，供渲染和计算使用 */
  const latestScrollTopRef = useRef(0);
  /** 记录已提交用于动态 overscan 计算的滚动位置 */
  const committedScrollTopRef = useRef(0);

  /** 根据已测量高度重新生成每一项的 top / bottom 区间 */
  const measurements = useMemo(() => {
    return createVirtualMeasurements({
      count: dataSource.length,
      estimatedItemHeight: itemHeight,
      measuredHeights: measuredHeightsRef.current,
    });
  }, [dataSource.length, itemHeight, measurementVersion]);

  /** 基于当前滚动位置计算需要真正挂载的可视区间 */
  const range = useMemo(() => {
    return getVisibleRange({
      measurements,
      viewportHeight: height,
      scrollTop,
      overscan: activeOverscan,
    });
  }, [activeOverscan, height, measurements, scrollTop]);

  /** 给 scrollToKey 建立索引，避免每次滚动时都线性查找 */
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

  /** 保存最近一次计算出的区间，供 registerItem 修正滚动锚点 */
  useEffect(() => {
    visibleRangeRef.current = range;
  }, [range]);

  /** 外部 overscan 变更时同步内部基线值 */
  useEffect(() => {
    setActiveOverscan(overscan);
  }, [overscan]);

  /** 数据缩短时清理失效高度缓存，避免旧索引污染新的布局 */
  useEffect(() => {
    const staleKeys = Array.from(measuredHeightsRef.current.keys()).filter(
      (index) => index >= dataSource.length,
    );

    if (!staleKeys.length) {
      return;
    }

    staleKeys.forEach((index) => {
      measuredHeightsRef.current.delete(index);
    });

    setMeasurementVersion((value) => value + 1);
  }, [dataSource.length]);

  /** 空列表时把内部滚动状态复位 */
  useEffect(() => {
    if (!dataSource.length && scrollTop !== 0) {
      setScrollTop(0);
    }
  }, [dataSource.length, scrollTop]);

  /** 统一维护 DOM scrollTop 与 React 状态，供内部和外部滚动 API 复用 */
  const syncScrollTop = useCallback(
    (nextScrollTop: number) => {
      if (!containerRef.current) {
        return;
      }

      if (containerRef.current.scrollTop !== nextScrollTop) {
        containerRef.current.scrollTop = nextScrollTop;
      }

      latestScrollTopRef.current = containerRef.current.scrollTop;
      committedScrollTopRef.current = containerRef.current.scrollTop;
      setActiveOverscan(overscan);
      setScrollTop(containerRef.current.scrollTop);
    },
    [overscan],
  );

  /** 将当前滚动结果透出给业务侧，返回真实可视区而不是 overscan 区间 */
  const emitScrollInfo = useCallback(
    (nextScrollTop: number) => {
      if (!containerRef.current) {
        return;
      }

      const nextRange = getVisibleRange({
        measurements,
        viewportHeight: height,
        scrollTop: nextScrollTop,
        overscan: activeOverscan,
      });

      onScroll?.({
        scrollTop: nextScrollTop,
        scrollHeight: containerRef.current.scrollHeight,
        clientHeight: containerRef.current.clientHeight,
        start: nextRange.visibleStart,
        end: nextRange.visibleEnd,
      });
    },
    [activeOverscan, height, measurements, onScroll],
  );

  /** 按指定 scrollTop 进行滚动，作为对外暴露的基础能力 */
  const scrollTo = useCallback(
    (nextScrollTop: number) => {
      syncScrollTop(nextScrollTop);
      emitScrollInfo(nextScrollTop);
    },
    [emitScrollInfo, syncScrollTop],
  );

  /** 先通过测量信息换算目标位置，再复用 scrollTo 完成滚动 */
  const scrollToIndex = useCallback(
    (index: number, align: ScrollAlign = 'auto') => {
      const nextScrollTop = getScrollTopByIndex({
        align,
        containerHeight: height,
        currentScrollTop: containerRef.current?.scrollTop || 0,
        index,
        measurements,
      });

      scrollTo(nextScrollTop);
    },
    [height, measurements, scrollTo],
  );

  /** 支持业务按主键滚动，不需要自行维护索引 */
  const scrollToKey = useCallback(
    (key: Key, align: ScrollAlign = 'auto') => {
      const index = keyIndexMap.get(key);

      if (typeof index === 'number') {
        scrollToIndex(index, align);
      }
    },
    [keyIndexMap, scrollToIndex],
  );

  /** 暴露给父组件的滚动控制能力 */
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

  /** 原生滚动事件只做两件事：更新 scrollTop、通知业务可视区变化 */
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const nextScrollTop = event.currentTarget.scrollTop;
      const nextOverscan = getAdaptiveOverscan({
        baseOverscan: overscan,
        itemHeight,
        previousScrollTop: committedScrollTopRef.current,
        scrollTop: nextScrollTop,
        viewportHeight: height,
      });

      latestScrollTopRef.current = nextScrollTop;
      committedScrollTopRef.current = nextScrollTop;
      setActiveOverscan(nextOverscan);
      setScrollTop(nextScrollTop);
      emitScrollInfo(nextScrollTop);
    },
    [emitScrollInfo, height, itemHeight, overscan],
  );

  /** 首次渲染或内容变化后回填真实高度，并在必要时修正滚动位置避免跳动 */
  const registerItem = useCallback(
    (index: number, element: HTMLDivElement | null) => {
      if (!element) {
        return;
      }

      const nextHeight = Math.ceil(element.getBoundingClientRect().height);
      const previousHeight =
        measuredHeightsRef.current.get(index) || itemHeight;

      if (nextHeight === previousHeight) {
        return;
      }

      measuredHeightsRef.current.set(index, nextHeight);

      if (
        containerRef.current &&
        index < visibleRangeRef.current.visibleStart &&
        previousHeight > 0
      ) {
        const heightDelta = nextHeight - previousHeight;

        if (heightDelta !== 0) {
          containerRef.current.scrollTop += heightDelta;
          latestScrollTopRef.current = containerRef.current.scrollTop;
          committedScrollTopRef.current = containerRef.current.scrollTop;
          setScrollTop(containerRef.current.scrollTop);
        }
      }

      setMeasurementVersion((value) => value + 1);
    },
    [itemHeight],
  );

  /** 只截取当前区间的数据进行渲染，真正实现虚拟滚动 */
  const renderedItems = useMemo(() => {
    if (range.end < range.start) {
      return [];
    }

    return dataSource.slice(range.start, range.end + 1).map((item, offset) => {
      const index = range.start + offset;
      const measurement = measurements[index];
      const key =
        typeof itemKey === 'function'
          ? itemKey(item, index)
          : (item?.[itemKey] as Key) ?? index;
      const resolvedItemStyle =
        typeof itemStyle === 'function' ? itemStyle(item, index) : itemStyle;

      return (
        <div
          key={key}
          ref={(element: HTMLDivElement | null) => registerItem(index, element)}
          className={styles['list-item']}
          style={{
            top: measurement.top,
            ...resolvedItemStyle,
          }}
        >
          {renderItem(item, index)}
        </div>
      );
    });
  }, [
    dataSource,
    itemKey,
    itemStyle,
    measurements,
    range.end,
    range.start,
    registerItem,
    renderItem,
  ]);

  /** 空数据状态 */
  if (!dataSource.length) {
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
      {/** 幽灵容器负责撑开总高度，绝对定位的列表项挂在它内部 */}
      <div
        className={styles['list-phantom']}
        style={{ height: range.totalHeight }}
      >
        {renderedItems}
      </div>
    </div>
  );
};

const List = memo(forwardRef(ListComponent)) as <T extends Record<string, any>>(
  props: ListProps<T> & { ref?: React.Ref<ListRef> },
) => React.ReactElement;

export default List;
