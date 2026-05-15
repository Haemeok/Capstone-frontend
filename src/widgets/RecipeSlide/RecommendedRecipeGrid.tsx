import { ReactNode } from "react";

import { InFeedAdSlot } from "@/shared/adsense";
import { AdPlaceholder } from "@/shared/adsense/AdPlaceholder";
import { AD_MIN_HEIGHT, AD_SLOT_IDS, IS_AD_TEST_MODE } from "@/shared/adsense/config";
import {
  type FeedItem,
  insertAdsIntoFeed,
} from "@/shared/adsense/lib/insertAdsIntoFeed";
import BudgetTierBadge from "@/shared/ui/badge/BudgetTierBadge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe";

import { RecipeSaveButton } from "@/features/recipe-save";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

const AD_EVERY_N = 4;

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

const RecommendedSlideLoading = () => (
  <div className="flex w-full gap-3 overflow-x-auto">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex-shrink-0">
        <Skeleton className="h-[200px] w-[200px] rounded-xl" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    ))}
  </div>
);

const RecommendedSlideError = () => (
  <div className="flex h-30 w-full items-center justify-center py-8">
    <p className="text-sm text-gray-500">
      잠시 서버에 문제가 있어요. 나중에 다시 시도해주세요.
    </p>
  </div>
);

const RecommendedSlideEmpty = () => (
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
    if (isLoading) return <RecommendedSlideLoading />;
    if (error) return <RecommendedSlideError />;
    if (recipes.length === 0) return <RecommendedSlideEmpty />;

    const feedItems: FeedItem<DetailedRecipeGridItemType>[] = insertAdsIntoFeed(
      recipes,
      AD_EVERY_N
    );

    return (
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {feedItems.map((item) => {
            if (item.__kind === "ad") {
              return (
                <CarouselItem
                  key={item.key}
                  className="basis-2/5 pl-3 sm:basis-[200px]"
                >
                  <RecommendedAdCell adIndex={item.adIndex} />
                </CarouselItem>
              );
            }

            const recipe = item.recipe;
            return (
              <CarouselItem
                key={recipe.id}
                className="basis-2/5 pl-3 sm:basis-[200px]"
              >
                <DetailedRecipeGridItem
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
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden cursor-pointer md:flex" />
        <CarouselNext className="-right-4 hidden cursor-pointer md:flex" />
      </Carousel>
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
