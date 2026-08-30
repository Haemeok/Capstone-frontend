import type { Locale } from "@/shared/i18n";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";

type BudgetServerSlideProps = {
  title: string;
  locale: Locale;
  prefetch?: boolean | null;
};

const BudgetServerSlide = async ({
  title,
  locale,
  prefetch,
}: BudgetServerSlideProps) => {
  const { content, fetchFailed } = await getStaticRecipesOnServer({
    maxCost: 10000,
    sort: "desc",
    key: "budget-recipes",
    ...(locale === "ko" ? {} : { lang: locale }),
  });

  return (
    <RecipeSlideWithErrorBoundary
      title={title}
      staticRecipes={content}
      locale={locale}
      fetchFailed={fetchFailed}
      prefetch={prefetch}
    />
  );
};

export default BudgetServerSlide;
