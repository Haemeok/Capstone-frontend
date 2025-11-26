import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Image } from "@/shared/ui/image/Image";

import { RecipeDailySummary } from "@/entities/user";

type CalendarDayPhotoProps = {
  date: Date;
  summary: RecipeDailySummary;
};

export const CalendarDayPhoto = ({ date, summary }: CalendarDayPhotoProps) => {
  const router = useRouter();
  const yyyyMMdd = format(date, "yyyy-MM-dd");

  const handleNavigateToCalendarDetail = () => {
    router.push(`/calendar/${yyyyMMdd}`);
  };

  return (
    <td
      className="group relative h-full w-full cursor-pointer p-[1px]"
      onClick={handleNavigateToCalendarDetail}
    >
      <Image
        src={summary.firstImageUrl}
        alt={`이벤트: ${format(date, "yyyy-MM-dd")}`}
        wrapperClassName="overflow-hidden rounded-xl"
        imgClassName="ease-in-out group-hover:scale-110"
        fit="cover"
        lazy={true}
      />
      {summary.totalCount && (
        <div className="bg-olive-mint absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
          {summary.totalCount}
        </div>
      )}
    </td>
  );
};
