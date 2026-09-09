export type AdReportDateRange = {
  from: string;
  to: string;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const parseCalendarDate = (value: string): Date => {
  const match = DATE_PATTERN.exec(value);

  if (!match) {
    throw new Error(`Invalid calendar date: ${value}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid calendar date: ${value}`);
  }

  return date;
};

export const formatCalendarDate = (date: Date): string => {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCalendarDayNumber = (value: string): number => {
  const date = parseCalendarDate(value);

  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
};

const addCalendarDays = (value: string, amount: number): string => {
  const date = parseCalendarDate(value);
  const shiftedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount
  );

  return formatCalendarDate(shiftedDate);
};

export const getInclusiveDayCount = (range: AdReportDateRange): number =>
  Math.floor(
    (getCalendarDayNumber(range.to) - getCalendarDayNumber(range.from)) /
      DAY_IN_MILLISECONDS
  ) + 1;

export const getRecentRange = (
  maxDate: string,
  minDate: string,
  dayCount: number
): AdReportDateRange => {
  const calculatedFrom = addCalendarDays(maxDate, -(dayCount - 1));

  return {
    from: calculatedFrom < minDate ? minDate : calculatedFrom,
    to: maxDate,
  };
};

export const formatTriggerRange = ({ from, to }: AdReportDateRange): string => {
  const fromDate = parseCalendarDate(from);
  const toDate = parseCalendarDate(to);
  const fromLabel = `${fromDate.getFullYear()}. ${fromDate.getMonth() + 1}. ${fromDate.getDate()}`;
  const toLabel =
    fromDate.getFullYear() === toDate.getFullYear()
      ? `${toDate.getMonth() + 1}. ${toDate.getDate()}`
      : `${toDate.getFullYear()}. ${toDate.getMonth() + 1}. ${toDate.getDate()}`;

  return `${fromLabel} – ${toLabel}`;
};

export const formatRangeSummary = ({ from, to }: AdReportDateRange): string => {
  const fromDate = parseCalendarDate(from);
  const toDate = parseCalendarDate(to);

  return `${fromDate.getMonth() + 1}월 ${fromDate.getDate()}일 – ${toDate.getMonth() + 1}월 ${toDate.getDate()}일 · ${getInclusiveDayCount({ from, to })}일간`;
};

export const isSameRange = (
  left: AdReportDateRange,
  right: AdReportDateRange
): boolean => left.from === right.from && left.to === right.to;
