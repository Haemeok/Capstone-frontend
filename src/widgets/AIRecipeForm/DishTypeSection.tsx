import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ChefHat } from "lucide-react";

import { DISH_TYPES } from "@/shared/config/constants/recipe";
import SelectionSection from "@/shared/ui/SelectionSection";

import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const DISH_TYPES_WITH_EMOJI = [
  "🍽️ 전체",
  "🍳 볶음",
  "🍲 국/찌개/탕",
  "🥩 구이",
  "🥗 무침/샐러드",
  "🍤 튀김/부침",
  "🥘 찜/조림",
  "🍕 오븐요리",
  "🍣 생식/회",
  "🥒 절임/피클류",
  "🍝 밥/면/파스타",
  "🍰 디저트/간식류",
];

const DishTypeSection = () => {
  const { control, setValue } = useFormContext<AIRecipeFormValues>();
  const dishType = useWatch({ control, name: "dishType" });

  const toggleCategory = (categoryWithEmoji: string) => {
    const index = DISH_TYPES_WITH_EMOJI.indexOf(categoryWithEmoji);
    const actualCategory = DISH_TYPES[index];
    setValue("dishType", actualCategory);
  };

  const selectedWithEmoji = dishType
    ? DISH_TYPES_WITH_EMOJI[DISH_TYPES.indexOf(dishType)]
    : "";

  return (
    <SelectionSection
      title="요리 종류"
      icon={<ChefHat size={18} />}
      items={DISH_TYPES_WITH_EMOJI}
      selectedItems={selectedWithEmoji}
      onToggle={toggleCategory}
      isSingleSelect
    />
  );
};

export default DishTypeSection;
