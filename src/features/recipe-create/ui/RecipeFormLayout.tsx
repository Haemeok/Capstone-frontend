import { useFormContext } from "react-hook-form";

import { DISH_TYPES_FOR_CREATE_RECIPE } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import { useFormProgress } from "@/shared/lib/hooks/useFormProgress";

import {
  RecipeFormValues,
  recipeFormSchema,
  FIELD_LABELS,
} from "@/features/recipe-create";
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
  isEdit: boolean;
};

const RecipeFormLayout = ({
  handleMainIngredientRemoved,
  isLoading,
  recipeCreationError: submitError,
  onSubmit,
  isEdit,
}: RecipeFormLayoutProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const { missingFieldLabels } = useFormProgress<RecipeFormValues>(
    recipeFormSchema,
    { fieldLabels: FIELD_LABELS }
  );

  return (
    <form id="recipe-form" onSubmit={onSubmit}>
      <RecipeHeaderSection image={<MainImageField />} title={<TitleField />} />
      <div className="pt-6">
        <Container maxWidth="3xl">
          <Description />

          <div className="mb-4 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="dishType" className="font-medium text-gray-700">
                {FIELD_LABELS.dishType}
              </label>
              <select
                id="dishType"
                className={cn(
                  `focus:border-olive-light focus:ring-olive-light w-28 cursor-pointer rounded-lg border bg-gray-50 px-3 py-1.5 text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:ring-1 focus:outline-none`,
                  errors.dishType ? "border-red-500" : "border-olive-light"
                )}
                {...register("dishType", {
                  required: "필수",
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
              <div className="min-h-[32px] w-28">
                {errors.dishType && (
                  <p className="text-center text-xs text-red-500">
                    {errors.dishType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="cookingTime"
                className="font-medium text-gray-700"
              >
                {FIELD_LABELS.cookingTime} (분)
              </label>
              <input
                id="cookingTime"
                type="text"
                inputMode="numeric"
                className={cn(
                  `focus:border-olive-light focus:ring-olive-light w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm text-gray-900 transition-colors duration-150 ease-in-out focus:ring-1 focus:outline-none`,
                  errors.cookingTime ? "border-red-500" : "border-gray-300"
                )}
                placeholder="숫자"
                {...register("cookingTime", {
                  validate: (value) => {
                    if (!value) return true;
                    const num = Number(value);
                    if (isNaN(num)) return "숫자만 입력 가능합니다";
                    if (num < 1) return "1분 이상 입력해주세요";
                    return true;
                  },
                })}
              />
              <div className="min-h-[32px] w-24">
                {errors.cookingTime && (
                  <p className="text-center text-xs text-red-500">
                    {errors.cookingTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <ServingCounter />

          <IngredientSection
            onRemoveIngredientCallback={handleMainIngredientRemoved}
          />
          <Steps />
          <CookingToolsInput />
          <TagSection />
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            {missingFieldLabels.length > 0 && (
              <p className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-600">
                다음 항목을 입력해주세요:{" "}
                <span className="font-semibold">
                  {missingFieldLabels.join(", ")}
                </span>
              </p>
            )}
            {submitError && (
              <p className="text-sm text-red-600">
                오류: {submitError.message}
              </p>
            )}
            <RecipeProgressButton isLoading={isLoading} isEdit={isEdit} />
          </div>
        </Container>
      </div>
    </form>
  );
};

export default RecipeFormLayout;
