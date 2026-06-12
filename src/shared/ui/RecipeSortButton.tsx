import React from "react";

import { cn } from "@/shared/lib/utils";
import { ChevronDownIcon } from "@/shared/ui/icons";

type RecipeSortButtonProps = {
  currentSort: string;
} & React.ComponentPropsWithoutRef<"button">;

const RecipeSortButton = React.forwardRef<
  HTMLButtonElement,
  RecipeSortButtonProps
>(({ currentSort, className, ...props }, ref) => {
  const isDirty = currentSort !== "최신순";

  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-0.5 rounded-2xl border px-2 py-1",
        isDirty ? "bg-dark-light" : "bg-white",
        isDirty ? "border-dark-light" : "border-gray-300",
        className
      )}
      aria-label={`정렬 순서 변경: 현재 ${currentSort}`}
      {...props}
    >
      <p className={cn("text-[15px]", isDirty ? "text-white" : "text-ink-sub")}>
        {currentSort}
      </p>
      <ChevronDownIcon
        className={cn(isDirty ? "text-white" : "text-ink-sub")}
        size={20}
      />
    </button>
  );
});

RecipeSortButton.displayName = "RecipeSortButton";

export default RecipeSortButton;
