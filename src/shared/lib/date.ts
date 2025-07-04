import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export const formatTimeAgo = (date: Date | string | number): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: ko,
    });
  } catch (error) {
    console.error("Failed to format time ago:", error);
    return "유효하지 않은 날짜";
  }
};
