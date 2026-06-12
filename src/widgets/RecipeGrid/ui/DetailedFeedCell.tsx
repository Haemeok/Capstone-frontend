import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";

import { RecipeSaveButton } from "@/features/recipe-save";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

const calculateSavings = (
  marketPrice?: number,
  ingredientCost?: number
): number | null => {
  if (!marketPrice || !ingredientCost) return null;
  const savings = marketPrice - ingredientCost;
  return savings > 0 ? savings : null;
};

type DetailedFeedCellProps = {
  recipe: DetailedRecipeGridItemType;
  priority: boolean;
  prefetch: boolean;
  onImageRetry?: () => void;
  locale?: "ko" | "ja";
};

const DetailedFeedCell = ({
  recipe,
  priority,
  prefetch,
  onImageRetry,
  locale,
}: DetailedFeedCellProps) => {
  const savings = calculateSavings(recipe.marketPrice, recipe.ingredientCost);

  const saveBadge = (
    <RecipeSaveButton
      key="save"
      recipeId={recipe.id}
      initialIsFavorite={recipe.favoriteByCurrentUser}
      buttonClassName="text-white"
      iconClassName="fill-gray-300 opacity-80"
    />
  );

  const infoBadge = savings ? (
    <div
      key="savings"
      className="from-olive-light to-olive-medium inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 shadow-sm"
    >
      <span className="text-xs font-bold text-white">
        {savings.toLocaleString()}원 절약
      </span>
    </div>
  ) : null;

  return (
    <DetailedRecipeGridItem
      recipe={recipe}
      priority={priority}
      prefetch={prefetch}
      infoBadge={infoBadge}
      saveBadge={saveBadge}
      onImageRetry={onImageRetry}
      locale={locale}
    />
  );
};

export default DetailedFeedCell;
