import { format, recipeGridMessages } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

import { StaticDetailedRecipeGridItem } from "@/entities/recipe";

import RecipeSlideSection from "./RecipeSlideSection";

type RecipeSlideWithErrorBoundaryProps = {
  title: string;
  to?: string;
  staticRecipes?: StaticDetailedRecipeGridItem[];
  locale?: "ko" | "ja" | "en";
};

const RecipeSlideWithErrorBoundary = ({
  title,
  to,
  staticRecipes = [],
  locale,
}: RecipeSlideWithErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="mt-2 w-full">
          <h2 className="text-ink mb-4 text-lg font-bold">{title}</h2>
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-ink-muted text-sm">
              {format(recipeGridMessages[locale ?? "ko"].slideLoadError, {
                title,
              })}
            </p>
          </div>
        </div>
      }
    >
      <RecipeSlideSection
        title={title}
        to={to}
        recipes={staticRecipes}
        isLoading={false}
        error={null}
        locale={locale}
      />
    </ErrorBoundary>
  );
};

export default RecipeSlideWithErrorBoundary;
