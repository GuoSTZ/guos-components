import { getBoxSelectOptions } from '../utils';

describe('BoxSelect utils', () => {
  it('should return built-in week options', () => {
    const result = getBoxSelectOptions({ type: 'week' });
    expect(result).toEqual([
      { label: '周一', value: 1 },
      { label: '周二', value: 2 },
      { label: '周三', value: 3 },
      { label: '周四', value: 4 },
      { label: '周五', value: 5 },
      { label: '周六', value: 6 },
      { label: '周日', value: 7 },
    ]);
  });

  it('should return month options from 1 to 31', () => {
    const result = getBoxSelectOptions({ type: 'month' });
    expect(result[0]).toEqual({ label: '1', value: 1 });
    expect(result[30]).toEqual({ label: '31', value: 31 });
    expect(result).toHaveLength(31);
  });

  it('should return custom options when type is custom', () => {
    const dataSource = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];
    const result = getBoxSelectOptions({ type: 'custom', dataSource });
    expect(result).toEqual(dataSource);
  });

  it('should return empty array when custom type has no dataSource', () => {
    const result = getBoxSelectOptions({ type: 'custom' });
    expect(result).toEqual([]);
  });
});
