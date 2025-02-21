export const getLabel = (
  dicts: Record<string, Array<Record<string, unknown>>>,
  dict: string,
  text: string | number,
) => {
  if (!dicts || !dict) {
    return '';
  }
  if (!text) {
    return dicts[dict];
  }
  return dicts[dict].find((item) => item.value === text)?.label || '';
};

export const formatNumberToChinese = (num: number): string => {
  if (num < 10000) {
    return num.toString();
  }

  const units = [
    { value: 1e8, label: '亿' },
    { value: 1e4, label: '万' },
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const value = num / unit.value;
      const formattedValue = Math.floor(value * 100) / 100;
      return `${formattedValue}${unit.label}`;
    }
  }

  return num.toString();
};
