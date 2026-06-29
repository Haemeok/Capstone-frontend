import { format, recipeGridMessages } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

import { StaticDetailedRecipeGridItem } from "@/entities/recipe";

import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

type RecipeSlideWithErrorBoundaryProps = {
  title: string;
  to?: string;
  staticRecipes?: StaticDetailedRecipeGridItem[];
  locale?: "ko" | "ja" | "en";
  requiresMeta?: boolean;
  metaName?: string | null;
  emphasizeTime?: boolean;
  fetchFailed?: boolean;
};

const RecipeSlideWithErrorBoundary = ({
  title,
  to,
  staticRecipes = [],
  locale,
  requiresMeta,
  metaName,
  emphasizeTime,
  fetchFailed = false,
}: RecipeSlideWithErrorBoundaryProps) => {
  if (
    !fetchFailed &&
    shouldHideRecipeSlide({
      isLoading: false,
      hasError: false,
      recipeCount: staticRecipes.length,
      requiresMeta,
      metaName,
    })
  ) {
    return null;
  }

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
        error={fetchFailed ? new Error("slide fetch failed") : null}
        locale={locale}
        emphasizeTime={emphasizeTime}
      />
    </ErrorBoundary>
  );
};

export default RecipeSlideWithErrorBoundary;
