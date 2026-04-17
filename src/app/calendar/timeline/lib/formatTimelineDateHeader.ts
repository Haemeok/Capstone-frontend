import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export const formatTimelineDateHeader = (
  date: string,
  prevDate?: string
): string => {
  const current = parseISO(date);
  const currentYear = current.getFullYear();

  const shouldShowYear =
    prevDate === undefined || parseISO(prevDate).getFullYear() !== currentYear;

  const pattern = shouldShowYear ? "yyyy년 M월 d일 EEEE" : "M월 d일 EEEE";
  return format(current, pattern, { locale: ko });
};
