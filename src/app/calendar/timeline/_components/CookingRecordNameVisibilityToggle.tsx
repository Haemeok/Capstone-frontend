"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type CookingRecordNameVisibilityToggleProps = {
  isVisible: boolean;
  label: string;
  description: string;
  onChange: (visible: boolean) => void;
};

export const CookingRecordNameVisibilityToggle = ({
  isVisible,
  label,
  description,
  onChange,
}: CookingRecordNameVisibilityToggleProps) => {
  const handleToggle = () => {
    triggerHaptic("Light");
    onChange(!isVisible);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isVisible}
      aria-label={label}
      onClick={handleToggle}
      className="focus-visible:outline-olive-dark flex min-h-15 w-full cursor-pointer items-center justify-between gap-4 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="min-w-0">
        <strong className="text-ink block text-sm font-semibold">
          {label}
        </strong>
        <span className="text-ink-muted mt-0.5 block text-xs leading-5">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
          isVisible ? "bg-olive-light" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            isVisible && "translate-x-5"
          )}
        />
      </span>
    </button>
  );
};
