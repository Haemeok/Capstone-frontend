import React from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type RecipeSortButtonProps = {
  currentSort: string;
  onClick: () => void;
  className?: string;
};

const RecipeSortButton = ({ 
  currentSort, 
  onClick, 
  className 
}: RecipeSortButtonProps) => {
  const isDirty = currentSort !== "최신순";

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-0.5 rounded-2xl border px-2 py-1",
        isDirty ? "bg-dark-light" : "bg-white",
        isDirty ? "border-dark-light" : "border-gray-300",
        className
      )}
      onClick={onClick}
      aria-label={`정렬 순서 변경: 현재 ${currentSort}`}
      aria-expanded={false}
    >
      <p
        className={cn(
          "text-[15px]",
          isDirty ? "text-white" : "text-dark-light"
        )}
      >
        {currentSort}
      </p>
      <ChevronDown
        className={cn(isDirty ? "text-white" : "text-dark-light")}
        size={20}
      />
    </button>
  );
};

export default RecipeSortButton;