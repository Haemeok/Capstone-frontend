"use client";

import { Utensils, Apple } from "lucide-react";

import IconToggle from "@/shared/ui/IconToggle";

type NutritionToggleProps = {
  isNutrition: boolean;
  onToggle: (isNutrition: boolean) => void;
  className?: string;
};

const NutritionToggle = ({
  isNutrition,
  onToggle,
  className,
}: NutritionToggleProps) => {
  return (
    <IconToggle<boolean>
      leftOption={{
        icon: <Utensils className="h-4 w-4" strokeWidth={2} />,
        label: "재료",
        value: false,
      }}
      rightOption={{
        icon: <Apple className="h-4 w-4" strokeWidth={2} />,
        label: "영양성분",
        value: true,
      }}
      value={isNutrition}
      onChange={onToggle}
      className={className}
    />
  );
};

export default NutritionToggle;
