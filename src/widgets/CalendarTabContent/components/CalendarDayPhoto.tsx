import { format } from "date-fns";

import { useLocalizedRouter } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { CookingRecordCalendarDailySummary } from "@/entities/recipe";

type CalendarDayPhotoProps = {
  date: Date;
  summary: CookingRecordCalendarDailySummary;
  isToday: boolean;
  dayCountBadgeLabel: string;
  recordAlt: string;
};

export const CalendarDayPhoto = ({
  date,
  summary,
  isToday,
  dayCountBadgeLabel,
  recordAlt,
}: CalendarDayPhotoProps) => {
  const router = useLocalizedRouter();
  const yyyyMMdd = format(date, "yyyy-MM-dd");

  const handleNavigateToCalendarDetail = () => {
    triggerHaptic("Light");
    router.push(`/calendar/${yyyyMMdd}`);
  };

  return (
    <td className="h-full w-full p-[1px]">
      <button
        type="button"
        aria-label={recordAlt}
        onClick={handleNavigateToCalendarDetail}
        className="focus-visible:outline-olive-dark group relative h-full min-h-11 w-full cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span
          className={cn(
            "text-ink-sub absolute top-1 left-1/2 z-10 -translate-x-1/2 text-xs",
            isToday && "text-olive-dark font-semibold"
          )}
        >
          {date.getDate()}
        </span>
        {isToday ? (
          <span
            data-testid="calendar-day-today-dot"
            aria-hidden="true"
            className="bg-olive-dark absolute top-5 left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full"
          />
        ) : null}
        {summary.firstImageUrl ? (
          <span className="absolute right-1 bottom-0 left-1 h-[calc(100%-1.25rem)]">
            <Image
              src={summary.firstImageUrl}
              alt=""
              aria-hidden="true"
              wrapperClassName="h-full w-full"
              imgClassName="transition-opacity duration-200 group-active:opacity-80"
              fit="contain"
              lazy={true}
              skeleton={<span aria-hidden="true" />}
              errorFallback={<span aria-hidden="true" />}
            />
          </span>
        ) : null}
        {summary.totalCount > 1 ? (
          <span
            data-testid="calendar-day-count-badge"
            aria-hidden="true"
            className="bg-ink/80 absolute right-0.5 bottom-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold whitespace-nowrap text-white"
          >
            {dayCountBadgeLabel}
          </span>
        ) : null}
      </button>
    </td>
  );
};
