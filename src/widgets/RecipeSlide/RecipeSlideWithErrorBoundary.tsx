import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

import { StaticDetailedRecipeGridItem } from "@/entities/recipe";

import DynamicRecipeSlide from "./DynamicRecipeSlide";
import StaticRecipeSlide from "./StaticRecipeSlide";

type RecipeSlideWithErrorBoundaryProps = {
  title: string;
  queryKey: string;
  isAiGenerated?: boolean;
  tags?: string[];
  to?: string;
  maxCost?: number;
  period?: "weekly" | "monthly";
  isStatic?: boolean;
  staticRecipes?: StaticDetailedRecipeGridItem[];
};

const RecipeSlideWithErrorBoundary = ({
  title,
  queryKey,
  isAiGenerated,
  tags,
  to,
  maxCost,
  period,
  isStatic = false,
  staticRecipes = [],
}: RecipeSlideWithErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="mt-2 w-full">
          <h2 className="mb-4 text-xl font-bold text-gray-800">{title}</h2>
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-sm text-gray-500">
              {title}을 불러올 수 없어요. 새로고침해주세요.
            </p>
          </div>
        </div>
      }
    >
      {isStatic ? (
        <StaticRecipeSlide
          title={title}
          to={to}
          staticRecipes={staticRecipes}
        />
      ) : (
        <DynamicRecipeSlide
          title={title}
          queryKey={queryKey}
          to={to}
          isAiGenerated={isAiGenerated}
          tags={tags}
          maxCost={maxCost}
          period={period}
        />
      )}
    </ErrorBoundary>
  );
};

export default RecipeSlideWithErrorBoundary;
