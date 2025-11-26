"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getProductByPrice } from "@/shared/lib/recipe";
import { DayPickerDynamic } from "@/shared/ui/DayPickerDynamic";
import Box from "@/shared/ui/primitives/Box";

import { RecipeDailySummary } from "@/entities/user";

import { cn } from "@/lib/utils";

import { useRecipeHistoryQuery, useUserStreakQuery } from "./hooks";
import { CalendarMode } from "./types";
import { findConsecutiveRanges, getRangeForDay } from "./lib/consecutiveDaysHelper";
import { StreakModeToggle } from "./components/StreakModeToggle";
import { StreakInfoBanner } from "./components/StreakInfoBanner";
import { CalendarDayStreak } from "./components/CalendarDayStreak";
import { CalendarDayPhoto } from "./components/CalendarDayPhoto";
import { CalendarDayEmpty } from "./components/CalendarDayEmpty";

import "react-day-picker/style.css";
import MonthlySavingsSummary from "../MonthlySavingsSummary";

const CalendarTabContent = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("streak");
  const { data: userStreak } = useUserStreakQuery();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  const { recipeHistorySummary, monthlyTotalSavings } = useRecipeHistoryQuery({
    year,
    month,
  });

  const getEventForDay = (day: Date): RecipeDailySummary | undefined => {
    return recipeHistorySummary?.find((summary) => {
      const summaryDate = new Date(summary.date);
      return (
        summaryDate.getDate() === day?.getDate() &&
        summaryDate.getMonth() === day?.getMonth() &&
        summaryDate.getFullYear() === day?.getFullYear()
      );
    });
  };

  const consecutiveRanges = findConsecutiveRanges(recipeHistorySummary ?? []);
  const product = getProductByPrice(monthlyTotalSavings ?? 0);

  return (
    <div className="w-full pb-8 md:pb-12">
      <MonthlySavingsSummary
        year={year}
        month={month}
        monthlyTotalSavings={monthlyTotalSavings}
        productName={product.name}
        productImage={product.image}
      />
      <div className="mt-4 flex items-center justify-center px-4">
        <StreakModeToggle mode={calendarMode} onModeChange={setCalendarMode} />
      </div>
      <Box className="mt-4 p-0 px-4">
        {calendarMode === "streak" ? (
          <StreakInfoBanner streakCount={userStreak?.streak ?? 0} />
        ) : null}
      </Box>
      <DayPickerDynamic
        mode="single"
        showOutsideDays
        locale={ko}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        formatters={{
          formatCaption: (month: Date) => format(month, "yyyy.M"),
        }}
        modifiers={{
          hasEvent: (date: Date) => getEventForDay(date) !== undefined,
        }}
        modifiersClassNames={{
          hasEvent: "has-event",
        }}
        className="w-full px-4"
        classNames={{
          months: "flex flex-col sm:flex-row gap-2 relative",
          month: "flex flex-col gap-4 w-full",
          month_caption:
            "flex text-xl font-bold text-center items-center justify-center h-9",

          caption: "flex justify-center pt-1 relative items-center w-full",
          caption_label: "text-xl font-bold",
          nav: "absolute  w-full flex justify-center items-center gap-20 h-9",
          week: "flex w-full h-15 md:h-30 text-center items-center",
          weeks: "flex flex-col w-full",
          weekdays: "flex w-full",
          weekday:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",

          disabled: "text-muted-foreground opacity-50",
          hidden: "invisible",
        }}
        components={{
          Day: ({ day }: any) => {
            const date = day?.date;
            const dateNumber = date?.getDate();

            if (date?.getMonth() !== day?.displayMonth.getMonth()) {
              return (
                <td className="flex h-full w-full items-center justify-center text-sm opacity-30">
                  {dateNumber}
                </td>
              );
            }

            const summary = getEventForDay(date);
            const today = new Date();
            const isToday =
              date?.getDate() === today.getDate() &&
              date?.getMonth() === today.getMonth() &&
              date?.getFullYear() === today.getFullYear();

            if (calendarMode === "streak") {
              const range = getRangeForDay(date, consecutiveRanges);
              if (summary) {
                return (
                  <CalendarDayStreak
                    date={date}
                    dateNumber={dateNumber}
                    range={range}
                  />
                );
              }
              return <CalendarDayEmpty dateNumber={dateNumber} isToday={isToday} />;
            } else {
              if (summary) {
                return <CalendarDayPhoto date={date} summary={summary} />;
              }
              return <CalendarDayEmpty dateNumber={dateNumber} isToday={isToday} />;
            }
          },
          PreviousMonthButton: ({ className, ...props }: any) => (
            <button
              className={cn(className, "flex items-center justify-center")}
              {...props}
            >
              <ChevronLeft className="size-6 text-gray-500" />
            </button>
          ),
          NextMonthButton: ({ className, ...props }: any) => (
            <button
              className={cn(className, "flex items-center justify-center")}
              {...props}
            >
              <ChevronRight className="size-6 text-gray-500" />
            </button>
          ),
        }}
      />
    </div>
  );
};

export default CalendarTabContent;
