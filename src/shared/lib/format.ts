export const formatNumber = (
  value: number | string | null | undefined,
  unit: string = "원"
): string => {
  const num = Number(value);
  const safeNumber = isNaN(num) ? 0 : num;

  const formattedNumber = new Intl.NumberFormat("ko-KR").format(safeNumber);

  return `${formattedNumber}${unit}`;
};

export const formatCount = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1).replace(/\.0$/, "")}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}만`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}천`;
  }
  return value.toString();
};
