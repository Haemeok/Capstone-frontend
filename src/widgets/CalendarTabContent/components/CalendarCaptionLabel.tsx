import type { CaptionLabelProps } from "react-day-picker";

import { cn } from "@/shared/lib/utils";

type CalendarCaptionLabelProps = CaptionLabelProps & {
  recordCountLabel: string;
};

export const CalendarCaptionLabel = ({
  children,
  className,
  recordCountLabel,
  ...props
}: CalendarCaptionLabelProps) => (
  <span
    {...props}
    data-testid="calendar-caption"
    className={cn(className, "flex items-baseline gap-2")}
  >
    <span className="text-ink text-xl font-bold">{children}</span>
    <span className="text-ink-muted text-sm font-normal">
      {recordCountLabel}
    </span>
  </span>
);
