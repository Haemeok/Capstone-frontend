"use client";

import { useState } from "react";
import type { DayProps } from "react-day-picker";

import { format, parseISO } from "date-fns";

import {
  type Locale,
  resolveDateFnsLocale,
  type UserPagesDict,
} from "@/shared/i18n";
import { DayPickerDynamic } from "@/shared/ui/DayPickerDynamic";
import Box from "@/shared/ui/primitives/Box";

import type { CookingRecordCalendarDailySummary } from "@/entities/recipe";

import { findConsecutiveRanges } from "../lib/consecutiveDaysHelper";
import type { CalendarMode } from "../types";
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
  streakCount: number;
  copy: UserPagesDict["calendar"];
  onMonthChange: (month: Date) => void;
};

export const CookingRecordCalendar = ({
  month,
  locale,
  summaries,
  streakCount,
  copy,
  onMonthChange,
}: CookingRecordCalendarProps) => {
  const [mode, setMode] = useState<CalendarMode>("photo");
  const ranges = findConsecutiveRanges(summaries);
  const getSummary = (date: Date) =>
    summaries.find((summary) => {
      const summaryDate = parseISO(summary.date);
      return summaryDate.toDateString() === date.toDateString();
    });

  return (
    <>
      <div className="mt-5 flex items-center justify-center px-5">
        <StreakModeToggle mode={mode} onModeChange={setMode} />
      </div>
      <Box className="mt-4 p-0 px-5">
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
        formatters={{ formatCaption: (value: Date) => format(value, "yyyy.M") }}
        modifiers={{ hasEvent: (date: Date) => getSummary(date) !== undefined }}
        modifiersClassNames={{ hasEvent: "has-event" }}
        className="w-full px-5"
        classNames={{
          months: "relative flex flex-col gap-2 sm:flex-row",
          month: "flex w-full flex-col gap-4",
          month_caption:
            "flex h-9 items-center justify-center text-xl font-bold",
          caption: "relative flex w-full items-center justify-center pt-1",
          caption_label: "text-xl font-bold",
          nav: "absolute flex h-9 w-full items-center justify-center gap-16",
          week: "flex h-15 w-full items-center text-center md:h-30",
          weeks: "flex w-full flex-col",
          weekdays: "flex w-full",
          weekday:
            "text-muted-foreground flex-1 rounded-md text-center text-sm font-normal",
          disabled: "text-muted-foreground opacity-50",
          hidden: "invisible",
        }}
        components={{
          Day: (props: DayProps) => (
            <CookingRecordCalendarDay
              {...props}
              mode={mode}
              summary={getSummary(props.day.date)}
              ranges={ranges}
              recordLabel={copy.timelineHeading}
            />
          ),
          PreviousMonthButton,
          NextMonthButton,
        }}
      />
    </>
  );
};
