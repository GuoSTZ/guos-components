import type { ReactNode } from 'react';

export type BoxSelectType = 'week' | 'month' | 'custom';

export type BoxSelectValue = string | number;

export interface BoxSelectOption {
  label: ReactNode;
  value: BoxSelectValue;
  disabled?: boolean;
}

interface GetBoxSelectOptionsParams {
  type?: BoxSelectType;
  dataSource?: BoxSelectOption[];
}

const WEEK_OPTIONS: BoxSelectOption[] = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 },
];

const MONTH_OPTIONS: BoxSelectOption[] = Array.from(
  { length: 31 },
  (_, idx) => {
    const value = idx + 1;
    return {
      label: String(value),
      value,
    };
  },
);

export const getBoxSelectOptions = (
  params: GetBoxSelectOptionsParams,
): BoxSelectOption[] => {
  const { type = 'week', dataSource } = params;
  if (type === 'custom') {
    return dataSource ?? [];
  }
  if (type === 'month') {
    return MONTH_OPTIONS;
  }
  return WEEK_OPTIONS;
};
