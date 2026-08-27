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
  stickerImageUrl: string | null;
  ranges: ConsecutiveRange[];
  recordLabel: string;
  recipeCountTemplate: Plural;
  dayCountBadgeTemplate: string;
  emptyDayAddRecordTemplate: string;
  canAddRecord: boolean;
  onAddRecord: (date: Date) => void;
};

export const CookingRecordCalendarDay = ({
  day,
  modifiers,
  mode,
  summary,
  stickerImageUrl,
  ranges,
  recordLabel,
  recipeCountTemplate,
  dayCountBadgeTemplate,
  emptyDayAddRecordTemplate,
  canAddRecord,
  onAddRecord,
}: CookingRecordCalendarDayProps) => {
  const date = day.date;
  const dateNumber = date.getDate();

  if (date.getMonth() !== day.displayMonth.getMonth()) {
    return (
      <td className="relative h-full w-full text-xs opacity-30">
        <span className="absolute top-1 left-1/2 -translate-x-1/2">
          {dateNumber}
        </span>
      </td>
    );
  }

  const isToday = modifiers.today;
  if (!summary) {
    const addRecordLabel = canAddRecord
      ? formatMessage(emptyDayAddRecordTemplate, {
          date: formatDate(date, "yyyy-MM-dd"),
        })
      : undefined;

    return (
      <CalendarDayEmpty
        dateNumber={dateNumber}
        isToday={isToday}
        addRecordLabel={addRecordLabel}
        onAddRecord={canAddRecord ? () => onAddRecord(date) : undefined}
      />
    );
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
      imageUrl={stickerImageUrl}
      isToday={isToday}
      dayCountBadgeLabel={dayCountBadgeLabel}
      recordAlt={`${formatDate(date, "yyyy-MM-dd")} ${recordLabel} ${recipeCountLabel}`}
    />
  );
};
