import { cn } from "@/shared/lib/utils";

type CalendarDayEmptyProps = {
  dateNumber: number;
  isToday: boolean;
};

export const CalendarDayEmpty = ({
  dateNumber,
  isToday,
}: CalendarDayEmptyProps) => {
  return (
    <td className="relative h-full w-full">
      <span
        className={cn(
          "text-ink-sub absolute top-1 left-1/2 -translate-x-1/2 text-xs",
          isToday && "text-olive-dark font-semibold"
        )}
      >
        {dateNumber}
        {isToday ? (
          <span
            data-testid="calendar-day-today-dot"
            aria-hidden="true"
            className="bg-olive-dark absolute top-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          />
        ) : null}
      </span>
    </td>
  );
};
