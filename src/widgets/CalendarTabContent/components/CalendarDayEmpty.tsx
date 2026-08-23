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
    <td className="flex h-full w-full items-center justify-center">
      <p
        className={cn(
          "text-ink-sub relative flex min-h-11 min-w-11 items-center justify-center text-center text-sm",
          isToday && "text-olive-dark font-semibold"
        )}
      >
        {dateNumber}
        {isToday ? (
          <span
            data-testid="calendar-day-today-dot"
            aria-hidden="true"
            className="bg-olive-dark absolute top-8 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          />
        ) : null}
      </p>
    </td>
  );
};
