"use client";

import { useFormContext } from "react-hook-form";

import { DISH_TYPES_FOR_CREATE_RECIPE } from "@/shared/config/constants/recipe";
import { format, useRecipeFormDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";

import type { RecipeFormValues } from "@/features/recipe-create/model/config";
import CookingToolsInput from "@/features/recipe-create/ui/CookingToolsInput";
import Description from "@/features/recipe-create/ui/Description";
import IngredientSection from "@/features/recipe-create/ui/IngredientSection";
import RecipeHeaderSection from "@/features/recipe-create/ui/RecipeHeaderSection";
import Steps from "@/features/recipe-create/ui/Steps";
import TagSection from "@/features/recipe-create/ui/TagSection";

import { MainImageField } from "../form/fields/MainImageField";
import { TitleField } from "../form/fields/TitleField";
import RecipeProgressButton, {
  type RecipeFormMode,
} from "./RecipeProgressButton";
import ServingCounter from "./ServingCounter";

type RecipeFormLayoutProps = {
  handleMainIngredientRemoved: (ingredientName: string) => void;
  isLoading: boolean;
  recipeCreationError: Error | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  mode: RecipeFormMode;
};

const RecipeFormLayout = ({
  handleMainIngredientRemoved,
  isLoading,
  recipeCreationError: submitError,
  onSubmit,
  mode,
}: RecipeFormLayoutProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();
  const { labels, ui } = useRecipeFormDict();
  const { localize } = useTaxonomy();

  return (
    <form id="recipe-form" onSubmit={onSubmit}>
      <Container maxWidth="3xl" padding={false}>
        <RecipeHeaderSection
          image={<MainImageField />}
          title={<TitleField />}
        />
      </Container>
      <div className="pt-6">
        <Container maxWidth="3xl">
          <Description />

          <div className="mb-4 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="dishType" className="text-ink-sub font-medium">
                {labels.dishType}
              </label>
              <select
                id="dishType"
                className={cn(
                  `focus:border-olive-light focus:ring-olive-light text-ink w-28 cursor-pointer rounded-lg border bg-gray-50 px-3 py-1.5 text-sm transition-colors duration-150 ease-in-out focus:ring-1 focus:outline-none`,
                  errors.dishType ? "border-red-500" : "border-olive-light"
                )}
                {...register("dishType", {
                  required: ui.dishTypeRequired,
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  {ui.dishTypePlaceholder}
                </option>
                {DISH_TYPES_FOR_CREATE_RECIPE.map((dishType) => (
                  <option key={dishType} value={dishType}>
                    {localize(dishType, "dishType")}
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
              <label htmlFor="cookingTime" className="text-ink-sub font-medium">
                {labels.cookingTime} {ui.cookingTimeUnitSuffix}
              </label>
              <input
                id="cookingTime"
                type="text"
                inputMode="numeric"
                className={cn(
                  `focus:border-olive-light focus:ring-olive-light text-ink w-20 rounded-lg border bg-gray-50 px-3 py-1.5 text-center text-sm transition-colors duration-150 ease-in-out focus:ring-1 focus:outline-none`,
                  errors.cookingTime ? "border-red-500" : "border-gray-300"
                )}
                placeholder={ui.cookingTimePlaceholder}
                {...register("cookingTime", {
                  validate: (value) => {
                    if (!value) return true;
                    const num = Number(value);
                    if (isNaN(num)) return ui.cookingTimeNumberOnly;
                    if (num < 1) return ui.cookingTimeMinValue;
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
          <div className="mt-8 flex flex-col items-center justify-center gap-4 pb-20 md:pb-8">
            {submitError && (
              <p className="text-sm text-red-600">
                {format(ui.submitErrorPrefix, { message: submitError.message })}
              </p>
            )}
            <RecipeProgressButton isLoading={isLoading} mode={mode} />
          </div>
        </Container>
      </div>
    </form>
  );
};

export default RecipeFormLayout;
