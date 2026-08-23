import type { DayProps } from "react-day-picker";

import { format as formatDate } from "date-fns";

import { format as formatMessage, type Plural, plural } from "@/shared/i18n";

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
  recipeCountTemplate: Plural;
  dayCountBadgeTemplate: string;
};

export const CookingRecordCalendarDay = ({
  day,
  modifiers,
  mode,
  summary,
  ranges,
  recordLabel,
  recipeCountTemplate,
  dayCountBadgeTemplate,
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

  const isToday = modifiers.today;
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
  const recipeCountLabel = formatMessage(
    plural(summary.totalCount, recipeCountTemplate),
    { count: summary.totalCount }
  );
  const dayCountBadgeLabel = formatMessage(dayCountBadgeTemplate, {
    count: summary.totalCount,
  });

  return (
    <CalendarDayPhoto
      date={date}
      summary={summary}
      isToday={isToday}
      dayCountBadgeLabel={dayCountBadgeLabel}
      recordAlt={`${formatDate(date, "yyyy-MM-dd")} ${recordLabel} ${recipeCountLabel}`}
    />
  );
};
