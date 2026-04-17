import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export const formatTimelineDateHeader = (date: string): string => {
  const current = parseISO(date);
  const isCurrentYear = current.getFullYear() === new Date().getFullYear();

  const pattern = isCurrentYear ? "M월 d일 EEEE" : "yyyy년 M월 d일 EEEE";
  return format(current, pattern, { locale: ko });
};
