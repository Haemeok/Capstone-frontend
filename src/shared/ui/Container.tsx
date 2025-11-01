import { type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;

  maxWidth?: "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

  noPadding?: boolean;
};

const MAX_WIDTH_CLASSES = {
  "3xl": "md:max-w-3xl",
  "4xl": "md:max-w-4xl",
  "5xl": "md:max-w-5xl",
  "6xl": "md:max-w-6xl",
  "7xl": "md:max-w-7xl",
} as const;

export const Container = ({
  children,
  className = "",
  maxWidth = "4xl",
  noPadding = false,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        !noPadding && "px-4 md:px-6",
        MAX_WIDTH_CLASSES[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};
