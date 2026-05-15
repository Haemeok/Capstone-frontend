import { ReactNode } from "react";

import { InFeedAdSlot } from "@/shared/adsense";
import { AdPlaceholder } from "@/shared/adsense/AdPlaceholder";
import { AD_MIN_HEIGHT, AD_SLOT_IDS, IS_AD_TEST_MODE } from "@/shared/adsense/config";
import {
  type FeedItem,
  insertAdsIntoFeed,
} from "@/shared/adsense/lib/insertAdsIntoFeed";
import BudgetTierBadge from "@/shared/ui/badge/BudgetTierBadge";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe";

import { RecipeSaveButton } from "@/features/recipe-save";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

const AD_EVERY_N = 4;

const GRID_CLASS =
  "grid gap-3 px-2 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(165px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

type RecommendedRecipeGridProps = {
  title: string;
  recipes: DetailedRecipeGridItemType[];
  isLoading: boolean;
  error: Error | null;
};

const getInfoBadge = (recipe: DetailedRecipeGridItemType): ReactNode => {
  if (recipe.ingredientCost) {
    return <BudgetTierBadge ingredientCost={recipe.ingredientCost} />;
  }
  return null;
};

const RecommendedAdCell = ({ adIndex }: { adIndex: number }) => {
  const slotId = AD_SLOT_IDS.searchInFeed[adIndex];
  if (slotId) return <InFeedAdSlot index={adIndex} />;
  if (IS_AD_TEST_MODE) {
    return <AdPlaceholder minHeight={AD_MIN_HEIGHT.inFeed} />;
  }
  return null;
};

const RecommendedGridLoading = () => (
  <div className={GRID_CLASS}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex flex-col gap-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);

const RecommendedGridError = () => (
  <div className="flex h-30 w-full items-center justify-center py-8">
    <p className="text-sm text-gray-500">
      잠시 서버에 문제가 있어요. 나중에 다시 시도해주세요.
    </p>
  </div>
);

const RecommendedGridEmpty = () => (
  <div className="flex w-full items-center justify-center py-8">
    <p className="text-sm text-gray-500">아직 레시피가 없어요.</p>
  </div>
);

const RecommendedRecipeGrid = ({
  title,
  recipes,
  isLoading,
  error,
}: RecommendedRecipeGridProps) => {
  const renderContent = () => {
    if (isLoading) return <RecommendedGridLoading />;
    if (error) return <RecommendedGridError />;
    if (recipes.length === 0) return <RecommendedGridEmpty />;

    const feedItems: FeedItem<DetailedRecipeGridItemType>[] = insertAdsIntoFeed(
      recipes,
      AD_EVERY_N
    );

    return (
      <div className={GRID_CLASS}>
        {feedItems.map((item) => {
          if (item.__kind === "ad") {
            return <RecommendedAdCell key={item.key} adIndex={item.adIndex} />;
          }

          const recipe = item.recipe;
          return (
            <DetailedRecipeGridItem
              key={recipe.id}
              recipe={recipe}
              prefetch
              hideCookingTime
              infoBadge={getInfoBadge(recipe)}
              saveBadge={
                <RecipeSaveButton
                  recipeId={recipe.id}
                  initialIsFavorite={recipe.favoriteByCurrentUser}
                  buttonClassName="text-white"
                  iconClassName="fill-gray-300 opacity-80"
                />
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-2 w-full">
      <div className="mb-2 flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {renderContent()}
    </div>
  );
};

export default RecommendedRecipeGrid;
