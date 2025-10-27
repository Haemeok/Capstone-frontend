"use client";

import { useState } from "react";
import { Image } from "@/shared/ui/image/Image";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, FlameKindling } from "lucide-react";

import { getProductByPrice } from "@/shared/lib/recipe";
import { DayPickerDynamic } from "@/shared/ui/DayPickerDynamic";
import PointDisplayBanner from "@/shared/ui/PointDisplayBanner";
import Box from "@/shared/ui/primitives/Box";

import { RecipeDailySummary } from "@/entities/user";

import { cn } from "@/lib/utils";

import { useRecipeHistoryQuery, useUserStreakQuery } from "./hooks";

import "react-day-picker/style.css";
import MonthlySavingsSummary from "../MonthlySavingsSummary";

const CalendarTabContent = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
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

  const product = getProductByPrice(monthlyTotalSavings ?? 0);

  return (
    <div className="w-full pb-4">
      <MonthlySavingsSummary
        year={year}
        month={month}
        monthlyTotalSavings={monthlyTotalSavings}
        productName={product.name}
        productImage={product.image}
      />
      <Box className="p-0 px-4 mt-4">
        <PointDisplayBanner
          pointText={`${userStreak?.streak ?? 0}일`}
          prefix="해먹 서비스를"
          suffix="연속 사용 중이에요!"
          textClassName="text-purple-500 font-bold"
          icon={
            <FlameKindling
              size={16}
              className="ml-1 fill-purple-500 text-purple-500"
            />
          }
        />
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
          week: "flex w-full h-15 text-center items-center",
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
            const router = useRouter();
            if (date?.getMonth() !== day?.displayMonth.getMonth()) {
              return (
                <td className="flex h-full w-full items-center justify-center text-sm opacity-30">
                  {dateNumber}
                </td>
              );
            }
            const yyyyMMdd = format(date, "yyyy-MM-dd");
            const summary = getEventForDay(date);
            const handleNavigateToCalendarDetail = () => {
              router.push(`/calendar/${yyyyMMdd}`);
            };
            if (summary) {
              return (
                <td
                  className="relative h-full w-full"
                  onClick={handleNavigateToCalendarDetail}
                >
                  <Image
                    src={summary.firstImageUrl}
                    alt={`이벤트: ${format(date, "yyyy-MM-dd")}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  {summary.totalCount && (
                    <div className="bg-olive-mint absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                      {summary.totalCount}
                    </div>
                  )}
                </td>
              );
            }
            const today = new Date();
            const isToday =
              date?.getDate() === today.getDate() &&
              date?.getMonth() === today.getMonth() &&
              date?.getFullYear() === today.getFullYear();

            return (
              <td
                className={cn("flex h-full w-full items-center justify-center")}
              >
                <p
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-center text-sm",
                    isToday && "bg-olive-light text-white"
                  )}
                >
                  {dateNumber}
                </p>
              </td>
            );
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
