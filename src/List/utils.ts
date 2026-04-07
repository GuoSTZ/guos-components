export type ScrollAlign = 'auto' | 'start' | 'center' | 'end';

export interface VirtualMeasurement {
  index: number;
  top: number;
  height: number;
  bottom: number;
}

export interface CreateVirtualMeasurementsOptions {
  count: number;
  estimatedItemHeight: number;
  measuredHeights: Map<number, number>;
}

export interface VisibleRangeOptions {
  measurements: VirtualMeasurement[];
  viewportHeight: number;
  scrollTop: number;
  overscan: number;
}

export interface ScrollTopByIndexOptions {
  measurements: VirtualMeasurement[];
  index: number;
  containerHeight: number;
  currentScrollTop: number;
  align?: ScrollAlign;
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
