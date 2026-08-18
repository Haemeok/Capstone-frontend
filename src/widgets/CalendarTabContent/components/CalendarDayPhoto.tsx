import { format } from "date-fns";

import { useLocalizedRouter } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import type { CookingRecordCalendarDailySummary } from "@/entities/recipe";

type CalendarDayPhotoProps = {
  date: Date;
  summary: CookingRecordCalendarDailySummary;
  recordAlt: string;
};

export const CalendarDayPhoto = ({
  date,
  summary,
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
        className="focus-visible:outline-olive-dark group rounded-card relative h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {summary.firstImageUrl ? (
          <Image
            src={summary.firstImageUrl}
            alt=""
            aria-hidden="true"
            wrapperClassName="overflow-hidden rounded-card"
            imgClassName="transition-all duration-300 ease-in-out group-hover:scale-110"
            fit="cover"
            lazy={true}
          />
        ) : (
          <span className="text-ink-sub text-sm">{date.getDate()}</span>
        )}
        {summary.totalCount ? (
          <span className="bg-olive-mint absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
            {summary.totalCount}
          </span>
        ) : null}
      </button>
    </td>
  );
};
