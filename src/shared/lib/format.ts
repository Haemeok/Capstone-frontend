export const formatNumber = (
  value: number | string | null | undefined,
  unit: string = "원"
): string => {
  const num = Number(value);
  const safeNumber = isNaN(num) ? 0 : num;

  const formattedNumber = new Intl.NumberFormat("ko-KR").format(safeNumber);

  return `${formattedNumber}${unit}`;
};
