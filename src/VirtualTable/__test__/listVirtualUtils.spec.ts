import {
  getHorizontalVisibleRange,
  shouldSyncHorizontalScroll,
} from '../listVirtualUtils';

describe('VirtualTable horizontal range', () => {
  it('should include only columns intersecting viewport with overscan', () => {
    const widths = [100, 120, 80, 160, 90, 110];

    expect(
      getHorizontalVisibleRange({
        columnWidths: widths,
        scrollLeft: 130,
        viewportWidth: 210,
        overscan: 1,
      }),
    ).toEqual({
      start: 0,
      end: 4,
      totalWidth: 660,
    });
  });

  it('should clamp visible range when viewport reaches far right', () => {
    const widths = [100, 120, 80, 160, 90, 110];

    expect(
      getHorizontalVisibleRange({
        columnWidths: widths,
        scrollLeft: 560,
        viewportWidth: 220,
        overscan: 2,
      }),
    ).toEqual({
      start: 3,
      end: 5,
      totalWidth: 660,
    });
  });

  it('should only sync horizontal scroll when scrollLeft changed', () => {
    expect(shouldSyncHorizontalScroll(0, 0)).toBe(false);
    expect(shouldSyncHorizontalScroll(120, 120.2)).toBe(false);
    expect(shouldSyncHorizontalScroll(120, 121.1)).toBe(true);
  });
});
