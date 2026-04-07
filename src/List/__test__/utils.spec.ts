import {
  createVirtualMeasurements,
  getScrollTopByIndex,
  getVisibleRange,
} from '../utils';

describe('List virtualization helpers', () => {
  it('should merge estimated height and measured height into cumulative layout data', () => {
    const measurements = createVirtualMeasurements({
      count: 4,
      estimatedItemHeight: 40,
      measuredHeights: new Map([
        [1, 72],
        [3, 56],
      ]),
    });

    expect(measurements).toEqual([
      { index: 0, top: 0, height: 40, bottom: 40 },
      { index: 1, top: 40, height: 72, bottom: 112 },
      { index: 2, top: 112, height: 40, bottom: 152 },
      { index: 3, top: 152, height: 56, bottom: 208 },
    ]);
  });

  it('should calculate visible range with overscan based on scroll position', () => {
    const measurements = createVirtualMeasurements({
      count: 5,
      estimatedItemHeight: 40,
      measuredHeights: new Map([
        [1, 72],
        [2, 52],
      ]),
    });

    expect(
      getVisibleRange({
        measurements,
        viewportHeight: 90,
        scrollTop: 80,
        overscan: 1,
      }),
    ).toEqual({
      start: 0,
      end: 4,
      offset: 0,
      visibleStart: 1,
      visibleEnd: 3,
      totalHeight: 244,
    });
  });

  it('should compute scroll offset for index alignment', () => {
    const measurements = createVirtualMeasurements({
      count: 5,
      estimatedItemHeight: 50,
      measuredHeights: new Map([[2, 90]]),
    });

    expect(
      getScrollTopByIndex({
        align: 'start',
        containerHeight: 120,
        currentScrollTop: 0,
        index: 2,
        measurements,
      }),
    ).toBe(100);

    expect(
      getScrollTopByIndex({
        align: 'end',
        containerHeight: 120,
        currentScrollTop: 0,
        index: 2,
        measurements,
      }),
    ).toBe(70);

    expect(
      getScrollTopByIndex({
        align: 'auto',
        containerHeight: 120,
        currentScrollTop: 80,
        index: 2,
        measurements,
      }),
    ).toBe(80);
  });
});
