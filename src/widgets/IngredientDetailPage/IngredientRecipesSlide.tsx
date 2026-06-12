"use client";

import { format, getDictionary, type Locale } from "@/shared/i18n";
import { getEuroParticle } from "@/shared/lib/korean";

import { useIngredientRecipesQuery } from "@/entities/ingredient";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

type IngredientRecipesSlideProps = {
  ingredientId: string;
  ingredientName: string;
  locale?: Locale;
};

const buildTitle = (name: string, locale: Locale): string =>
  locale === "ko"
    ? `${name}${getEuroParticle(name)} 만든 인기 레시피`
    : format(getDictionary(locale).ingredientDetail.popularRecipesTitle, {
        name,
      });

const IngredientRecipesSlide = ({
  ingredientId,
  ingredientName,
  locale = "ko",
}: IngredientRecipesSlideProps) => {
  const { data, isLoading, error } = useIngredientRecipesQuery(
    ingredientId,
    locale
  );
  const recipes = data?.content ?? [];

  return (
    <RecipeSlide
      title={buildTitle(ingredientName, locale)}
      recipes={recipes}
      isLoading={isLoading}
      error={error as Error | null}
      locale={locale}
    />
  );
};

export default IngredientRecipesSlide;
