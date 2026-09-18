"use client";

import { type CSSProperties, useState } from "react";
import type { DayProps } from "react-day-picker";

import { format as formatDate, isAfter, parseISO, startOfDay } from "date-fns";

import {
  format as formatMessage,
  type Locale,
  plural,
  resolveDateFnsLocale,
  type UserPagesDict,
} from "@/shared/i18n";
import { DayPickerDynamic } from "@/shared/ui/DayPickerDynamic";
import Box from "@/shared/ui/primitives/Box";

import type {
  CookingRecordCalendarDailySummary,
  CookingRecordListItem,
} from "@/entities/recipe";

import { findConsecutiveRanges } from "../lib/consecutiveDaysHelper";
import type { CalendarMode } from "../types";
import { CalendarCaptionLabel } from "./CalendarCaptionLabel";
import {
  NextMonthButton,
  PreviousMonthButton,
} from "./CalendarMonthNavigation";
import { CookingRecordCalendarDay } from "./CookingRecordCalendarDay";
import { StreakInfoBanner } from "./StreakInfoBanner";
import { StreakModeToggle } from "./StreakModeToggle";

import "react-day-picker/style.css";

type CookingRecordCalendarProps = {
  month: Date;
  locale: Locale;
  summaries: CookingRecordCalendarDailySummary[];
  stickerImageUrlByDate: Record<string, string>;
  displayRecordByDate?: Record<string, CookingRecordListItem>;
  hasCalendarData: boolean;
  streakCount: number;
  copy: UserPagesDict["calendar"];
  onMonthChange: (month: Date) => void;
  onAddRecord: (date: Date) => void;
};

type CalendarDayPickerStyle = CSSProperties & {
  "--rdp-nav_button-height": string;
  "--rdp-nav_button-width": string;
};

const CALENDAR_DAY_PICKER_STYLE: CalendarDayPickerStyle = {
  "--rdp-nav_button-height": "2.75rem",
  "--rdp-nav_button-width": "2.75rem",
};

export const CookingRecordCalendar = ({
  month,
  locale,
  summaries,
  stickerImageUrlByDate,
  displayRecordByDate = {},
  hasCalendarData,
  streakCount,
  copy,
  onMonthChange,
  onAddRecord,
}: CookingRecordCalendarProps) => {
  const [mode, setMode] = useState<CalendarMode>("photo");
  const [today] = useState(() => startOfDay(new Date()));
  const ranges = findConsecutiveRanges(summaries);
  const recordCount = summaries.reduce(
    (total, summary) => total + summary.totalCount,
    0
  );
  const recordCountLabel = formatMessage(
    plural(recordCount, copy.cookingRecord.recordCount),
    { count: recordCount }
  );
  const getSummary = (date: Date) =>
    summaries.find((summary) => {
      const summaryDate = parseISO(summary.date);
      return summaryDate.toDateString() === date.toDateString();
    });

  return (
    <section className="mx-5 mt-7 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-ink text-lg font-bold">{copy.dateSectionTitle}</h2>
        <StreakModeToggle mode={mode} onModeChange={setMode} />
      </div>
      <Box className="mt-4 p-0">
        {mode === "streak" ? (
          <StreakInfoBanner streakCount={streakCount} />
        ) : null}
      </Box>
      <DayPickerDynamic
        mode="single"
        showOutsideDays
        locale={resolveDateFnsLocale(locale)}
        month={month}
        onMonthChange={onMonthChange}
        formatters={{
          formatCaption: (value: Date) =>
            new Intl.DateTimeFormat(locale, {
              year: "numeric",
              month: "long",
            }).format(value),
        }}
        modifiers={{ hasEvent: (date: Date) => getSummary(date) !== undefined }}
        modifiersClassNames={{ hasEvent: "has-event" }}
        className="mt-5 w-full"
        style={CALENDAR_DAY_PICKER_STYLE}
        classNames={{
          months: "relative flex flex-col gap-2 sm:flex-row",
          month: "flex w-full flex-col gap-3",
          month_caption: "flex h-11 items-center",
          month_grid:
            "rdp-month_grid -mx-3 w-[calc(100%+1.5rem)] md:mx-0 md:w-full",
          caption_label: "text-xl font-bold",
          nav: "absolute right-0 z-10 flex h-11 items-center gap-1",
          week: "rdp-week flex h-[72px] w-full items-center text-center md:h-24",
          weeks: "flex w-full flex-col",
          weekdays: "flex h-7 w-full border-b border-gray-100 pb-1",
          weekday: "text-ink-muted flex-1 text-center text-xs font-normal",
          disabled: "text-muted-foreground opacity-50",
          hidden: "invisible",
        }}
        components={{
          CaptionLabel: (props) => (
            <CalendarCaptionLabel
              {...props}
              recordCountLabel={hasCalendarData ? recordCountLabel : undefined}
            />
          ),
          Day: (props: DayProps) => (
            <CookingRecordCalendarDay
              {...props}
              mode={mode}
              summary={getSummary(props.day.date)}
              stickerImageUrl={
                stickerImageUrlByDate[
                  formatDate(props.day.date, "yyyy-MM-dd")
                ] ?? null
              }
              displayRecord={
                displayRecordByDate[formatDate(props.day.date, "yyyy-MM-dd")]
              }
              ranges={ranges}
              recordLabel={copy.timelineHeading}
              recipeCountTemplate={copy.daySummaryRecipeCount}
              dayCountBadgeTemplate={copy.dayCountBadge}
              emptyDayAddRecordTemplate={copy.emptyDayAddRecord}
              canAddRecord={
                hasCalendarData && !isAfter(startOfDay(props.day.date), today)
              }
              onAddRecord={onAddRecord}
            />
          ),
          PreviousMonthButton,
          NextMonthButton,
        }}
      />
    </section>
  );
};
