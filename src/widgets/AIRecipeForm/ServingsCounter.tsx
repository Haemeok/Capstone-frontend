import { User } from "lucide-react";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const ServingsCounter = () => {
  const { control, setValue } = useFormContext<AIRecipeFormValues>();
  const servings = useWatch({ control, name: "servings" });

  const handleIncrementServings = () => {
    setValue("servings", servings + 1, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDecrementServings = () => {
    if (servings > 1) {
      setValue("servings", servings - 1, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-olive-mint">
          <User size={18} />
        </span>
        <h2 className="text-lg font-semibold text-gray-800">인분</h2>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleDecrementServings}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300 disabled:opacity-50"
          disabled={servings <= 1}
        >
          -
        </button>
        <span className="w-20 text-center font-medium text-gray-800">
          {servings}인분
        </span>
        <button
          type="button"
          onClick={handleIncrementServings}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </>
  );
};

export default ServingsCounter;
