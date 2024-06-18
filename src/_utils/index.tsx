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
