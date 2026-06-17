import { useFormContext, useWatch } from "react-hook-form";

import { Plus, X } from "lucide-react";

import { INGREDIENT_IMAGE_URL } from "@/shared/config/constants/recipe";
import { useT } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";

import type { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

type IngredientManagerProps = {
  onOpenDrawer: () => void;
};

const IngredientManager = ({ onOpenDrawer }: IngredientManagerProps) => {
  const t = useT();
  const { control, setValue } = useFormContext<AIRecipeFormValues>();

  const ingredients = useWatch({
    control,
    name: "ingredients",
    defaultValue: [],
  });

  const handleRemoveAllIngredients = () => {
    setValue("ingredients", [], { shouldDirty: true });
  };

  const handleRemoveIngredient = (index: number) => {
    const next = ingredients.filter((_, i) => i !== index);
    setValue("ingredients", next, { shouldDirty: true });
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label={t.aiRecipe.form.ingredientManager.addButtonAriaLabel}
        className="hover:bg-olive-light/80 border-olive-light flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-[#f7f7f7] p-5 transition-all duration-300"
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 rounded-full bg-white p-3 shadow-md">
            <Plus size={24} className="text-olive-light" aria-hidden="true" />
          </div>
          <span className="text-olive-light font-medium">
            {t.aiRecipe.form.ingredientManager.addButtonLabel}
          </span>
          <span className="text-ink-muted mt-1 text-sm">
            {ingredients.length > 0
              ? `${ingredients.length}${t.aiRecipe.form.ingredientManager.ingredientsAddedCount}`
              : t.aiRecipe.form.ingredientManager.addPrompt}
          </span>
        </div>
      </button>

      {ingredients.length > 0 && (
        <div className="bg-olive-light/10 mt-4 rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-olive-light text-sm font-medium">
              {t.aiRecipe.form.ingredientManager.selectedHeading}
            </h3>
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAllIngredients();
                }}
                aria-label={t.aiRecipe.form.ingredientManager.removeAllLabel}
                className="cursor-pointer px-2 py-1 text-xs text-red-600 hover:text-red-800"
              >
                {t.aiRecipe.form.ingredientManager.removeAllLabel}
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-x-1 gap-y-4 min-[375px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
            {ingredients.map((ingredient, index) => {
              // i18n-ignore: 미마이그레이션
              const removeAriaLabel = `${ingredient.name} 삭제`;
              return (
                <div
                  key={ingredient.id || ingredient.name}
                  className="group relative flex flex-col items-center gap-1.5"
                >
                  <div className="relative">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white bg-white shadow-sm ring-1 ring-green-100/50">
                      <Image
                        src={INGREDIENT_IMAGE_URL(ingredient.name)}
                        alt={ingredient.name}
                        wrapperClassName="h-full w-full"
                        fit="cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveIngredient(index);
                      }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      aria-label={removeAriaLabel}
                    >
                      <X size={10} strokeWidth={3} aria-hidden="true" />
                    </button>
                  </div>
                  <span className="text-ink-sub w-full truncate text-center text-xs font-medium">
                    {ingredient.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManager;
