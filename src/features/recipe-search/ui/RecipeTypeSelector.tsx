"use client";

import { cn } from "@/shared/lib/utils";
import UserRecipeBadge from "@/shared/ui/badge/UserRecipeBadge";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

type RecipeTypeSelectorProps = {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
};

const RECIPE_TYPES = [
  {
    value: "USER",
    label: "사용자 레시피",
    badge: <UserRecipeBadge className="bg-gray-200" />,
  },
  {
    value: "AI",
    label: "AI 레시피",
    badge: <AIGeneratedBadge />,
  },
  {
    value: "YOUTUBE",
    label: "유튜브 레시피",
    badge: <YouTubeIconBadge />,
  },
] as const;

export const RecipeTypeSelector = ({
  selectedTypes,
  onTypesChange,
}: RecipeTypeSelectorProps) => {
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    onTypesChange(newTypes);
  };

  return (
    <div className="space-y-3 border-b pb-4">
      <h5 className="text-sm font-semibold text-gray-700">레시피 유형</h5>
      <div className="grid grid-cols-3 gap-3">
        {RECIPE_TYPES.map(({ value, label, badge }) => {
          const isSelected = selectedTypes.includes(value);

          return (
            <button
              key={value}
              onClick={() => handleTypeToggle(value)}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-end gap-2 rounded-xl p-4 transition-all",
                isSelected
                  ? "bg-olive-light/10 border-olive-light border-2"
                  : "border-2 border-transparent bg-gray-50 hover:border-gray-300"
              )}
            >
              {badge}
              <span className="text-center text-xs leading-tight font-medium text-gray-700">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
