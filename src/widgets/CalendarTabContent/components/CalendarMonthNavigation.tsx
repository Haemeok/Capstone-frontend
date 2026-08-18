"use client";

import type {
  NextMonthButtonProps,
  PreviousMonthButtonProps,
} from "react-day-picker";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

const handleMonthClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
) => {
  triggerHaptic("Light");
  onClick?.(event);
};

export const PreviousMonthButton = ({
  className,
  onClick,
  ...props
}: PreviousMonthButtonProps) => (
  <button
    className={cn(className, "flex items-center justify-center")}
    onClick={(event) => handleMonthClick(event, onClick)}
    {...props}
  >
    <ChevronLeft aria-hidden="true" className="text-ink-muted size-6" />
  </button>
);

export const NextMonthButton = ({
  className,
  onClick,
  ...props
}: NextMonthButtonProps) => (
  <button
    className={cn(className, "flex items-center justify-center")}
    onClick={(event) => handleMonthClick(event, onClick)}
    {...props}
  >
    <ChevronRight aria-hidden="true" className="text-ink-muted size-6" />
  </button>
);
