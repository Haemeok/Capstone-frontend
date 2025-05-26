import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import useRecipeHistoryQuery from '@/hooks/useRecipeHistoryQuery';
import { RecipeDailySummary } from '@/type/recipe';
import SavingSection from './SavingSection';
import 'react-day-picker/style.css';
import SuspenseImage from '@/components/Image/SuspenseImage';
import { useNavigate } from 'react-router';

export function CalendarTabContent() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1; // getMonth는 0부터 시작하므로 +1

  // useRecipeHistoryQuery 훅 사용
  const { recipeHistorySummary, monthlyTotalSavings, isLoading, error } =
    useRecipeHistoryQuery({ year, month });

  // 해당 날짜에 이벤트가 있는지 확인
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

  return (
    <div className="w-full">
      <div className="mx-10 mb-5 flex flex-col items-center justify-center border-b border-gray-200 pt-5">
        <h3 className="text-xl font-bold">지금까지 해먹 서비스로</h3>
        <div className="flex gap-1">
          <h3 className="text-olive-mint text-xl font-bold">4,200원</h3>
          <h3 className="text-xl font-bold"> 절약했어요</h3>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          커피 한 잔 정도 금액이에요!
        </p>
        <SavingSection />
      </div>
      <DayPicker
        mode="single"
        showOutsideDays
        locale={ko}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        formatters={{
          formatCaption: (month) => format(month, 'yyyy.M'),
        }}
        modifiers={{
          hasEvent: (date) => getEventForDay(date) !== undefined,
        }}
        modifiersClassNames={{
          hasEvent: 'has-event',
        }}
        className="w-full px-4"
        classNames={{
          months: 'flex flex-col sm:flex-row gap-2 relative',
          month: 'flex flex-col gap-4 w-full',
          month_caption:
            'flex text-xl font-bold text-center items-center justify-center h-9',

          caption: 'flex justify-center pt-1 relative items-center w-full',
          caption_label: 'text-xl font-bold',
          nav: 'absolute  w-full flex justify-center items-center gap-20 h-9',
          week: 'flex w-full h-15 text-center items-center',
          weeks: 'flex flex-col w-full',
          weekdays: 'flex w-full',
          weekday:
            'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center',

          disabled: 'text-muted-foreground opacity-50',
          hidden: 'invisible',
        }}
        components={{
          Day: ({ day }) => {
            const date = day?.date;
            const dateNumber = date?.getDate();
            if (date?.getMonth() !== day?.displayMonth.getMonth()) {
              return (
                <div className="flex h-full w-full items-center justify-center text-sm opacity-30">
                  {dateNumber}
                </div>
              );
            }
            const yyyyMMdd = format(date, 'yyyy-MM-dd');
            const summary = getEventForDay(date);
            const navigate = useNavigate();
            const handleNavigateToCalendarDetail = () => {
              navigate(`/calendar/${yyyyMMdd}`);
            };
            if (summary) {
              return (
                <div
                  className="relative h-full w-full"
                  onClick={handleNavigateToCalendarDetail}
                >
                  <SuspenseImage
                    src={summary.firstImageUrl}
                    alt={`이벤트: ${format(date, 'yyyy-MM-dd')}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  {summary.totalCount && (
                    <div className="bg-olive-mint absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                      {summary.totalCount}
                    </div>
                  )}
                </div>
              );
            }
            const today = new Date();
            const isToday =
              date?.getDate() === today.getDate() &&
              date?.getMonth() === today.getMonth() &&
              date?.getFullYear() === today.getFullYear();

            return (
              <div
                className={cn('flex h-full w-full items-center justify-center')}
              >
                <p
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-center text-sm',
                    isToday && 'bg-olive-light text-white',
                  )}
                >
                  {dateNumber}
                </p>
              </div>
            );
          },
          PreviousMonthButton: ({ className, ...props }) => (
            <button
              className={cn(className, 'flex items-center justify-center')}
              {...props}
            >
              <ChevronLeft className="size-6 text-gray-500" />
            </button>
          ),
          NextMonthButton: ({ className, ...props }) => (
            <button
              className={cn(className, 'flex items-center justify-center')}
              {...props}
            >
              <ChevronRight className="size-6 text-gray-500" />
            </button>
          ),
        }}
      />
    </div>
  );
}

export default CalendarTabContent;
