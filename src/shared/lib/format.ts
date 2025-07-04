export const formatPrice = (
  value: number | string | null | undefined,
  currencySymbol: string = "원"
): string => {
  const num = Number(value);
  const safeNumber = isNaN(num) ? 0 : num;

  const formattedNumber = new Intl.NumberFormat("ko-KR").format(safeNumber);

  return `${formattedNumber}${currencySymbol}`;
};
