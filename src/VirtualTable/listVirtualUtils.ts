type HorizontalVisibleRangeInput = {
  columnWidths: number[];
  scrollLeft: number;
  viewportWidth: number;
  overscan?: number;
};

type HorizontalVisibleRange = {
  start: number;
  end: number;
  totalWidth: number;
};

type HorizontalMetrics = {
  columnOffsets: number[];
  totalWidth: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const findColumnByOffset = (offsets: number[], target: number) => {
  let low = 0;
  let high = offsets.length - 1;
  let answer = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (offsets[mid] <= target) {
      answer = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return answer;
};

export const getHorizontalVisibleRange = ({
  columnWidths,
  scrollLeft,
  viewportWidth,
  overscan = 1,
}: HorizontalVisibleRangeInput): HorizontalVisibleRange => {
  if (columnWidths.length === 0) {
    return { start: 0, end: -1, totalWidth: 0 };
  }

  const offsets: number[] = new Array(columnWidths.length);
  let cursor = 0;

  for (let index = 0; index < columnWidths.length; index += 1) {
    offsets[index] = cursor;
    cursor += columnWidths[index];
  }

  const totalWidth = cursor;
  const viewportEnd = Math.max(scrollLeft + viewportWidth - 1, 0);
  const start = findColumnByOffset(
    offsets,
    clamp(scrollLeft, 0, Math.max(totalWidth - 1, 0)),
  );
  const end = findColumnByOffset(
    offsets,
    clamp(viewportEnd, 0, Math.max(totalWidth - 1, 0)),
  );

  return {
    start: clamp(start - overscan, 0, columnWidths.length - 1),
    end: clamp(end + overscan, 0, columnWidths.length - 1),
    totalWidth,
  };
};

export const getHorizontalMetrics = (
  columnWidths: number[],
): HorizontalMetrics => {
  const columnOffsets: number[] = new Array(columnWidths.length);
  let cursor = 0;

  for (let index = 0; index < columnWidths.length; index += 1) {
    columnOffsets[index] = cursor;
    cursor += columnWidths[index];
  }

  return {
    columnOffsets,
    totalWidth: cursor,
  };
};

export const shouldSyncHorizontalScroll = (
  previousScrollLeft: number,
  nextScrollLeft: number,
  epsilon = 1,
) => {
  return Math.abs(nextScrollLeft - previousScrollLeft) > epsilon;
};
