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
        "flex items-center justify-center gap-0.5 rounded-2xl border px-2 py-1 max-w-[120px]",
        isDirty ? "bg-dark-light" : "bg-white",
        isDirty ? "border-dark-light" : "border-gray-300"
      )}
      onClick={onClick}
    >
      <p
        className={cn(
          "text-[15px] truncate",
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
