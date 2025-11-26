import { cn } from "@/lib/utils";

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
          "flex h-10 w-10 items-center justify-center rounded-full text-center text-sm",
          isToday && "border-2 border-violet-500"
        )}
      >
        {dateNumber}
      </p>
    </td>
  );
};
