"use client";

import React from "react";

import { format } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";
import { ChevronDownIcon } from "@/shared/ui/icons";

type RecipeSortButtonProps = {
  currentSort: string;
} & React.ComponentPropsWithoutRef<"button">;

const RecipeSortButton = React.forwardRef<
  HTMLButtonElement,
  RecipeSortButtonProps
>(({ currentSort, className, ...props }, ref) => {
  const { dict, localize } = useTaxonomy();
  const isDirty = currentSort !== "최신순";
  const sortLabel = localize(currentSort, "recipeSort");

  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-0.5 rounded-2xl border px-2 py-1",
        isDirty ? "bg-dark-light" : "bg-white",
        isDirty ? "border-dark-light" : "border-gray-300",
        className
      )}
      aria-label={format(dict.filters.sortAria, { sort: sortLabel })}
      {...props}
    >
      <p className={cn("text-[15px]", isDirty ? "text-white" : "text-ink-sub")}>
        {sortLabel}
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
