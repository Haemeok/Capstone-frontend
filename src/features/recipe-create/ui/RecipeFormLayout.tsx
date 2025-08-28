import { cn } from "@/shared/lib/utils";

import { RecipeFormValues } from "@/features/recipe-create";
import CookingToolsInput from "@/features/recipe-create/ui/CookingToolsInput";
import Description from "@/features/recipe-create/ui/Description";
import IngredientSection from "@/features/recipe-create/ui/IngredientSection";
import RecipeTitleWithImage from "@/features/recipe-create/ui/RecipeTitleWithImage";
import Steps from "@/features/recipe-create/ui/Steps";
import TagSection from "@/features/recipe-create/ui/TagSection";
import { useFormContext } from "react-hook-form";
import RecipeProgressButton from "./RecipeProgressButton";
import { DISH_TYPES_FOR_CREATE_RECIPE } from "@/shared/config/constants/recipe";

type RecipeFormLayoutProps = {
  handleMainIngredientRemoved: (ingredientName: string) => void;
  isLoading: boolean;
  recipeCreationError: Error | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  ingredientIds?: number[];
};

const RecipeFormLayout = ({
  handleMainIngredientRemoved,
  isLoading,
  recipeCreationError: submitError,
  onSubmit,
  ingredientIds = [],
}: RecipeFormLayoutProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  return (
    <form id="recipe-form" onSubmit={onSubmit}>
      <RecipeTitleWithImage />

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <Description />

        <div className="flex items-center justify-center gap-x-8 gap-y-6 border-b border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="dishType"
              className="text-sm font-medium text-gray-700"
            >
              카테고리
            </label>
            <select
              id="dishType"
              className={cn(
                `w-28 rounded-lg border bg-gray-50 px-3 py-1.5 text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none`,
                errors.dishType ? "border-red-500" : "border-gray-300"
              )}
              {...register("dishType", {
                required: "카테고리를 선택해주세요",
              })}
              defaultValue=""
            >
              <option value="" disabled>
                선택
              </option>
              {DISH_TYPES_FOR_CREATE_RECIPE.map((dishType) => (
                <option key={dishType} value={dishType}>
                  {dishType}
                </option>
              ))}
            </select>
            {errors.dishType && (
              <p className="mt-1 text-center text-xs text-red-500">
                {errors.dishType.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="cookingTime"
              className="text-sm font-medium text-gray-700"
            >
              조리시간 (분)
            </label>
            <input
              id="cookingTime"
              type="number"
              className={cn(
                `w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none`,
                errors.cookingTime ? "border-red-500" : "border-gray-300"
              )}
              placeholder="숫자"
              min="0"
              {...register("cookingTime", {
                required: "조리 시간을 입력해주세요",
                valueAsNumber: true,
                min: { value: 1, message: "1분 이상 입력해주세요." },
              })}
            />
            {errors.cookingTime && (
              <p className="mt-1 text-center text-xs text-red-500">
                {errors.cookingTime.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="servings"
              className="text-sm font-medium text-gray-700"
            >
              인분
            </label>
            <input
              id="servings"
              type="number"
              className={cn(
                "w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                errors.servings
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300"
              )}
              {...register("servings", {
                required: "인분을 선택해주세요",
                valueAsNumber: true,
                validate: (value) =>
                  Number(value) > 0 || "1인분 이상 선택해주세요.",
              })}
              min="1"
              placeholder="숫자"
              defaultValue={1}
            />
            {errors.servings && (
              <p className="mt-1 text-center text-xs text-red-500">
                {errors.servings.message}
              </p>
            )}
          </div>
        </div>

        <IngredientSection
          onRemoveIngredientCallback={handleMainIngredientRemoved}
          ingredientIds={ingredientIds}
        />
        <Steps />
        <CookingToolsInput />
        <TagSection />
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          {submitError && (
            <p className="text-sm text-red-600">오류: {submitError.message}</p>
          )}
          <RecipeProgressButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
};

export default RecipeFormLayout;
