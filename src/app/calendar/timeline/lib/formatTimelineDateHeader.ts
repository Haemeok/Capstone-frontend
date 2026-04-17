import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

const CURRENT_YEAR = new Date().getFullYear();

export const formatTimelineDateHeader = (date: string): string => {
  const current = parseISO(date);
  const pattern =
    current.getFullYear() === CURRENT_YEAR
      ? "M월 d일 EEEE"
      : "yyyy년 M월 d일 EEEE";
  return format(current, pattern, { locale: ko });
};
