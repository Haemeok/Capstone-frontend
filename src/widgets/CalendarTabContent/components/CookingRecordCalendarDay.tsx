import type { DayProps } from "react-day-picker";

import { format } from "date-fns";

import type { CookingRecordCalendarDailySummary } from "@/entities/recipe";

import { getRangeForDay } from "../lib/consecutiveDaysHelper";
import type { CalendarMode, ConsecutiveRange } from "../types";
import { CalendarDayEmpty } from "./CalendarDayEmpty";
import { CalendarDayPhoto } from "./CalendarDayPhoto";
import { CalendarDayStreak } from "./CalendarDayStreak";

type CookingRecordCalendarDayProps = DayProps & {
  mode: CalendarMode;
  summary?: CookingRecordCalendarDailySummary;
  ranges: ConsecutiveRange[];
  recordLabel: string;
};

export const CookingRecordCalendarDay = ({
  day,
  mode,
  summary,
  ranges,
  recordLabel,
}: CookingRecordCalendarDayProps) => {
  const date = day.date;
  const dateNumber = date.getDate();

  if (date.getMonth() !== day.displayMonth.getMonth()) {
    return (
      <td className="flex h-full w-full items-center justify-center text-sm opacity-30">
        {dateNumber}
      </td>
    );
  }

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (!summary) {
    return <CalendarDayEmpty dateNumber={dateNumber} isToday={isToday} />;
  }
  if (mode === "streak") {
    return (
      <CalendarDayStreak
        date={date}
        dateNumber={dateNumber}
        range={getRangeForDay(date, ranges)}
      />
    );
  }
  return (
    <CalendarDayPhoto
      date={date}
      summary={summary}
      recordAlt={`${format(date, "yyyy-MM-dd")} ${recordLabel}`}
    />
  );
};
