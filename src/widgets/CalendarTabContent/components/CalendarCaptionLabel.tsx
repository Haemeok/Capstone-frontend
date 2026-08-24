import type { CaptionLabelProps } from "react-day-picker";

import { cn } from "@/shared/lib/utils";

type CalendarCaptionLabelProps = CaptionLabelProps & {
  recordCountLabel?: string;
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
    className={cn(className, "flex flex-col items-start gap-0.5")}
  >
    <span className="text-ink text-base font-bold">{children}</span>
    {recordCountLabel !== undefined ? (
      <span className="text-ink-muted text-xs font-normal">
        {recordCountLabel}
      </span>
    ) : null}
  </span>
);
