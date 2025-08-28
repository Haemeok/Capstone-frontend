import { Clock } from "lucide-react";

import {
  COOKING_TIME_ITEMS,
  COOKING_TIME_ITEMS_KEYS,
  COOKING_TIMES,
} from "@/shared/config/constants/recipe";
import SelectionSection from "@/shared/ui/SelectionSection";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { type AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const CookingTimeSection = () => {
  const { control, setValue } = useFormContext<AIRecipeFormValues>();
  const cookingTime = useWatch({ control, name: "cookingTime" });

  const toggleTime = (label: string) =>
    setValue(
      "cookingTime",
      COOKING_TIME_ITEMS[label as keyof typeof COOKING_TIME_ITEMS] ??
        COOKING_TIME_ITEMS["10분이내"]
    );

  return (
    <SelectionSection
      title="조리시간"
      icon={<Clock size={18} />}
      items={COOKING_TIMES}
      selectedItems={COOKING_TIME_ITEMS_KEYS[cookingTime]}
      onToggle={toggleTime}
      isSingleSelect={true}
    />
  );
};

export default CookingTimeSection;
