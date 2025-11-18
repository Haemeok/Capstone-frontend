import React from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FilterChipProps = {
  header: string;
  onClick: () => void;
  isDirty: boolean;
};

const FilterChip = ({ header, onClick, isDirty }: FilterChipProps) => {
  return (
    <button
      className={cn(
        "flex max-w-[120px] cursor-pointer items-center justify-center gap-0.5 rounded-2xl border px-2 py-1",
        isDirty ? "bg-dark-light" : "bg-white",
        isDirty ? "border-dark-light" : "border-gray-300"
      )}
      onClick={onClick}
      aria-label={`${header} 필터 열기`}
      aria-expanded={false}
    >
      <p
        className={cn(
          "truncate text-[15px]",
          isDirty ? "text-white" : "text-dark-light"
        )}
      >
        {header}
      </p>
      <ChevronDown
        className={cn(
          "flex-shrink-0",
          isDirty ? "text-white" : "text-dark-light"
        )}
        size={20}
      />
    </button>
  );
};

export default FilterChip;
