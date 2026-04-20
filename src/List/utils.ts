/** 滚动到目标项时的对齐策略 */
export type ScrollAlign = 'auto' | 'start' | 'center' | 'end';

/** 单条列表项在虚拟布局中的几何信息 */
export interface VirtualMeasurement {
  /** 列表项索引 */
  index: number;
  /** 列表项顶部距离容器顶部的偏移 */
  top: number;
  /** 列表项高度（真实测量值或估算值） */
  height: number;
  /** 列表项底部偏移，等于 top + height */
  bottom: number;
}

/** 生成虚拟测量数据时所需的输入参数 */
export interface CreateVirtualMeasurementsOptions {
  /** 列表总条数 */
  count: number;
  /** 未测量项的默认估算高度 */
  estimatedItemHeight: number;
  /** 已测量项高度缓存，key 为索引，value 为高度 */
  measuredHeights: Map<number, number>;
}

/** 计算当前可视区间时的输入参数 */
export interface VisibleRangeOptions {
  /** 列表项测量结果 */
  measurements: VirtualMeasurement[];
  /** 视口高度 */
  viewportHeight: number;
  /** 当前滚动位置 */
  scrollTop: number;
  /** 额外预渲染项数量 */
  overscan: number;
}

/** 根据索引换算 scrollTop 时所需参数 */
export interface ScrollTopByIndexOptions {
  /** 列表项测量结果 */
  measurements: VirtualMeasurement[];
  /** 目标索引 */
  index: number;
  /** 容器可视高度 */
  containerHeight: number;
  /** 当前滚动位置 */
  currentScrollTop: number;
  /** 目标对齐方式 */
  align?: ScrollAlign;
}

/** 计算动态 overscan 时所需参数 */
export interface AdaptiveOverscanOptions {
  /** 最小 overscan */
  baseOverscan: number;
  /** 当前滚动位置 */
  scrollTop: number;
  /** 上一次提交的滚动位置 */
  previousScrollTop: number;
  /** 当前视口高度 */
  viewportHeight: number;
  /** 列表项参考高度 */
  itemHeight: number;
}

/** 将数值限定在区间内，避免滚动位置越界 */
const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

/** 末项的 bottom 就是整个虚拟列表的总高度 */
const getTotalHeight = (measurements: VirtualMeasurement[]) => {
  return measurements[measurements.length - 1]?.bottom || 0;
};

/** 使用二分查找定位 offset 所处的列表项，避免滚动时线性扫描 */
const findNearestItem = (
  measurements: VirtualMeasurement[],
  offset: number,
): number => {
  let start = 0;
  let end = measurements.length - 1;
  let nearest = 0;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const current = measurements[middle];

    if (current.top <= offset) {
      nearest = middle;
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return nearest;
};

/** 把估算高度和真实高度合并成连续的测量结果，供布局和滚动计算复用 */
export const createVirtualMeasurements = ({
  count,
  estimatedItemHeight,
  measuredHeights,
}: CreateVirtualMeasurementsOptions) => {
  let top = 0;

  return Array.from({ length: count }, (_, index) => {
    const height = measuredHeights.get(index) || estimatedItemHeight;
    const measurement = {
      index,
      top,
      height,
      bottom: top + height,
    };

    top += height;

    return measurement;
  });
};

/** 根据 scrollTop 和视口高度，计算可视区与 overscan 渲染区 */
export const getVisibleRange = ({
  measurements,
  viewportHeight,
  scrollTop,
  overscan,
}: VisibleRangeOptions) => {
  if (!measurements.length) {
    return {
      start: 0,
      end: -1,
      offset: 0,
      visibleStart: 0,
      visibleEnd: -1,
      totalHeight: 0,
    };
  }

  const totalHeight = getTotalHeight(measurements);
  const safeScrollTop = clamp(scrollTop, 0, totalHeight);
  const safeViewportHeight = Math.max(viewportHeight, 0);
  const visibleStart = findNearestItem(measurements, safeScrollTop);
  const viewportBottom = safeScrollTop + safeViewportHeight;

  let visibleEnd = visibleStart;

  while (
    visibleEnd < measurements.length - 1 &&
    measurements[visibleEnd].bottom < viewportBottom
  ) {
    visibleEnd += 1;
  }

  const start = Math.max(visibleStart - overscan, 0);
  const end = Math.min(visibleEnd + overscan, measurements.length - 1);

  return {
    start,
    end,
    offset: measurements[start]?.top || 0,
    visibleStart,
    visibleEnd,
    totalHeight,
  };
};

/** 根据滚动跨度动态放大 overscan，降低快速滚动时的空白概率 */
export const getAdaptiveOverscan = ({
  baseOverscan,
  scrollTop,
  previousScrollTop,
  viewportHeight,
  itemHeight,
}: AdaptiveOverscanOptions) => {
  const safeBaseOverscan = Math.max(baseOverscan, 0);
  const safeViewportHeight = Math.max(viewportHeight, 0);
  const safeItemHeight = Math.max(itemHeight, 1);

  if (safeViewportHeight === 0) {
    return safeBaseOverscan;
  }

  const visibleCount = Math.max(
    Math.ceil(safeViewportHeight / safeItemHeight),
    safeBaseOverscan || 1,
  );
  const scrollDistance = Math.abs(scrollTop - previousScrollTop);
  const crossedViewportCount = Math.ceil(scrollDistance / safeViewportHeight);
  const extraOverscan = Math.min(crossedViewportCount * 3, visibleCount * 2);

  return safeBaseOverscan + extraOverscan;
};

/** 根据对齐方式把目标索引换算成最终应该滚到的 scrollTop */
export const getScrollTopByIndex = ({
  measurements,
  index,
  containerHeight,
  currentScrollTop,
  align = 'auto',
}: ScrollTopByIndexOptions) => {
  if (!measurements.length) {
    return 0;
  }

  const safeIndex = clamp(index, 0, measurements.length - 1);
  const measurement = measurements[safeIndex];
  const totalHeight = getTotalHeight(measurements);
  const maxScrollTop = Math.max(totalHeight - containerHeight, 0);
  const top = measurement.top;
  const bottom = measurement.bottom;
  const startAligned = top;
  const endAligned = bottom - containerHeight;
  const centerAligned = top - (containerHeight - measurement.height) / 2;

  if (align === 'start') {
    return clamp(startAligned, 0, maxScrollTop);
  }

  if (align === 'end') {
    return clamp(endAligned, 0, maxScrollTop);
  }

  if (align === 'center') {
    return clamp(centerAligned, 0, maxScrollTop);
  }

  if (top >= currentScrollTop && bottom <= currentScrollTop + containerHeight) {
    return clamp(currentScrollTop, 0, maxScrollTop);
  }

  if (top < currentScrollTop) {
    return clamp(startAligned, 0, maxScrollTop);
  }

  return clamp(endAligned, 0, maxScrollTop);
};
