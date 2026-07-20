"use client";

import { useState } from "react";

import { Bookmark } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type RecipeSaveButtonProps = {
  recipeId: string;
  initiallySaved: boolean;
  onToggle: (recipeId: string, isSaved: boolean) => void;
  disabled?: boolean;
};

const RecipeSaveButton = ({
  recipeId,
  initiallySaved,
  onToggle,
  disabled = false,
}: RecipeSaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(initiallySaved);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic("Light");
    const next = !isSaved;
    setIsSaved(next);
    onToggle(recipeId, next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isSaved}
      aria-label={isSaved ? "저장 취소" : "저장"}
      className={cn(
        "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-95",
        isSaved
          ? "border-olive-light bg-olive-light/10 text-olive-light"
          : "text-ink-sub hover:border-olive-light border-gray-200 bg-white",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      )}
    >
      <Bookmark
        size={16}
        className={cn(
          "transition-colors",
          isSaved ? "fill-olive-light stroke-olive-light" : "stroke-current"
        )}
      />
      <span>{isSaved ? "저장됨" : "저장"}</span>
    </button>
  );
};

export default RecipeSaveButton;
