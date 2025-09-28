import { useFormContext } from "react-hook-form";

import { DISH_TYPES_FOR_CREATE_RECIPE } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";

import { RecipeFormValues } from "@/features/recipe-create";
import CookingToolsInput from "@/features/recipe-create/ui/CookingToolsInput";
import Description from "@/features/recipe-create/ui/Description";
import IngredientSection from "@/features/recipe-create/ui/IngredientSection";
import Steps from "@/features/recipe-create/ui/Steps";
import TagSection from "@/features/recipe-create/ui/TagSection";

import RecipeProgressButton from "./RecipeProgressButton";
import RecipeHeaderSection from "@/features/recipe-create/ui/RecipeHeaderSection";
import { TitleField } from "../form/fields/TitleField";
import { MainImageField } from "../form/fields/MainImageField";
import ServingCounter from "./ServingCounter";

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
      <RecipeHeaderSection image={<MainImageField />} title={<TitleField />} />

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <Description />

        <div className="flex items-center mb-4 justify-center gap-x-8 gap-y-6 ">
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="dishType" className="font-medium text-gray-700">
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
            <label htmlFor="cookingTime" className=" font-medium text-gray-700">
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
        </div>
        <ServingCounter />

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
