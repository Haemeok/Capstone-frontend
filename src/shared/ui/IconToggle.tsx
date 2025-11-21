"use client";

import { cn } from "@/shared/lib/utils";

type IconToggleOption<T> = {
  icon: React.ReactNode;
  label: string;
  value: T;
};

type IconToggleProps<T extends string | boolean> = {
  leftOption: IconToggleOption<T>;
  rightOption: IconToggleOption<T>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

const IconToggle = <T extends string | boolean>({
  leftOption,
  rightOption,
  value,
  onChange,
  className,
}: IconToggleProps<T>) => {
  const isRightSelected = value === rightOption.value;

  return (
    <div
      className={cn(
        "flex h-8 w-44 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100 transition-all duration-300",
        className
      )}
      onClick={() =>
        onChange(isRightSelected ? leftOption.value : rightOption.value)
      }
      role="button"
      tabIndex={0}
      aria-label={`${isRightSelected ? leftOption.label : rightOption.label} 보기`}
    >
      <div className="relative flex w-full items-center justify-between overflow-hidden">
        <div
          className={cn(
            "absolute h-full w-1/2 scale-90 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
            isRightSelected
              ? "translate-x-full transform"
              : "translate-x-0 transform"
          )}
        />

        <div
          className={cn(
            "z-10 flex h-full w-1/2 items-center justify-center gap-1 transition-all duration-300",
            !isRightSelected ? "opacity-100" : "opacity-40"
          )}
        >
          <div
            className={cn(
              "transition-colors duration-300",
              !isRightSelected ? "text-gray-800" : "text-gray-500"
            )}
          >
            {leftOption.icon}
          </div>
          <span
            className={cn(
              "text-sm font-medium transition-colors duration-300",
              !isRightSelected ? "text-gray-800" : "text-gray-500"
            )}
          >
            {leftOption.label}
          </span>
        </div>

        <div
          className={cn(
            "z-10 flex h-full w-1/2 items-center justify-center gap-1 transition-all duration-300",
            isRightSelected ? "opacity-100" : "opacity-40"
          )}
        >
          <div
            className={cn(
              "transition-colors duration-300",
              isRightSelected ? "text-gray-800" : "text-gray-500"
            )}
          >
            {rightOption.icon}
          </div>
          <span
            className={cn(
              "text-sm font-medium transition-colors duration-300",
              isRightSelected ? "text-gray-800" : "text-gray-500"
            )}
          >
            {rightOption.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IconToggle;
