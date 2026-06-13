import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ChefHat } from "lucide-react";

import { DISH_TYPES } from "@/shared/config/constants/recipe";
import { useT } from "@/shared/i18n";
import SelectionSection from "@/shared/ui/SelectionSection";

import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const DishTypeSection = () => {
  const t = useT();
  const { control, setValue } = useFormContext<AIRecipeFormValues>();
  const dishType = useWatch({ control, name: "dishType" });

  const options = t.aiRecipe.form.dishType.options;

  const toggleCategory = (categoryWithEmoji: string) => {
    const index = options.indexOf(categoryWithEmoji);
    const actualCategory = DISH_TYPES[index];
    setValue("dishType", actualCategory);
  };

  const selectedWithEmoji = dishType
    ? options[DISH_TYPES.indexOf(dishType)]
    : "";

  return (
    <SelectionSection
      title={t.aiRecipe.form.dishType.sectionTitle}
      icon={<ChefHat size={18} />}
      items={options}
      selectedItems={selectedWithEmoji}
      onToggle={toggleCategory}
      isSingleSelect
    />
  );
};

export default DishTypeSection;
