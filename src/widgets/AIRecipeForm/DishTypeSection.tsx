import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ChefHat } from "lucide-react";

import { DISH_TYPES } from "@/shared/config/constants/recipe";
import SelectionSection from "@/shared/ui/SelectionSection";

import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const DishTypeSection = () => {
  const { control, setValue } = useFormContext<AIRecipeFormValues>();
  const dishType = useWatch({ control, name: "dishType" });

  const toggleCategory = (category: string) => setValue("dishType", category);

  return (
    <SelectionSection
      title="요리 종류"
      icon={<ChefHat size={18} />}
      items={DISH_TYPES}
      selectedItems={dishType ? dishType : ""}
      onToggle={toggleCategory}
      isSingleSelect
    />
  );
};

export default DishTypeSection;
