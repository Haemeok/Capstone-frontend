import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { ConsecutiveRange } from "../types";
import { getFlameLevel } from "../lib/streakCalculator";
import { isFirstInRange, isLastInRange } from "../lib/consecutiveDaysHelper";
import { Fire } from "./fire";

type CalendarDayStreakProps = {
  date: Date;
  dateNumber: number;
  range?: ConsecutiveRange;
};

export const CalendarDayStreak = ({
  date,
  dateNumber,
  range,
}: CalendarDayStreakProps) => {
  const router = useRouter();
  const yyyyMMdd = format(date, "yyyy-MM-dd");

  const handleClick = () => {
    router.push(`/calendar/${yyyyMMdd}`);
  };

  if (!range) {
    return (
      <td className="flex h-full w-full items-center justify-center">
        <p className="flex h-10 w-10 items-center justify-center rounded-full text-center text-sm">
          {dateNumber}
        </p>
      </td>
    );
  }

  const flameConfig = getFlameLevel(range.dates.length);
  const isFirst = isFirstInRange(date, range);
  const isLast = isLastInRange(date, range);
  const isSingleDay = range.dates.length === 1;

  const getRoundedClass = () => {
    if (isSingleDay) return "rounded-full";
    if (isFirst) return "rounded-l-full";
    if (isLast) return "rounded-r-full";
    return "rounded-none";
  };

  return (
    <td
      className="group relative h-full w-full cursor-pointer p-0"
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute inset-0",
          flameConfig.bgColor,
          getRoundedClass()
        )}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-0.5">
        <Fire
          className={cn(flameConfig.flameColor, "h-6 w-6 md:h-10 md:w-10")}
        />
        <p className={cn("text-xs font-medium", flameConfig.flameColor)}>
          {dateNumber}
        </p>
      </div>
    </td>
  );
};
