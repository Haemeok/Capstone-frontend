import { ReactNode } from "react";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import YouTubeChannelBadge from "@/shared/ui/badge/YouTubeChannelBadge";
import BudgetTierBadge from "@/shared/ui/badge/BudgetTierBadge";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe";

import { RecipeLikeButton } from "@/features/recipe-like";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

type RecipeSlideProps = {
  title: string;
  to?: string;
  recipes: DetailedRecipeGridItemType[];
  isLoading: boolean;
  error: Error | null;
};

const getRecipeRightBadge = (recipe: DetailedRecipeGridItemType): ReactNode => {
  if (recipe.ingredientCost) {
    const tierBadge = (
      <BudgetTierBadge key="budget" ingredientCost={recipe.ingredientCost} />
    );
    if (tierBadge) return tierBadge;
  }

  if (recipe.isYoutube && recipe.youtubeChannelName) {
    return (
      <YouTubeChannelBadge key="youtube" channelName={recipe.youtubeChannelName} className="min-[390px]:max-w-[140px]" />
    );
  }

  if (recipe.isYoutube) {
    return <YouTubeIconBadge key="youtube" />;
  }

  if (recipe.isAiGenerated) {
    return <AIGeneratedBadge key="ai" />;
  }

  return null;
};

const RecipeSlideLoading = () => (
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

const RecipeSlideError = () => (
  <div className="flex h-30 w-full items-center justify-center py-8">
    <p className="text-sm text-gray-500">
      잠시 서버에 문제가 있어요. 나중에 다시 시도해주세요.
    </p>
  </div>
);

const RecipeSlideEmpty = () => (
  <div className="flex w-full items-center justify-center py-8">
    <p className="text-sm text-gray-500">아직 레시피가 없어요.</p>
  </div>
);

const RecipeSlide = ({
  title,
  to,
  recipes,
  isLoading,
  error,
}: RecipeSlideProps) => {
  const renderContent = () => {
    if (isLoading) return <RecipeSlideLoading />;
    if (error) return <RecipeSlideError />;
    if (recipes.length === 0) return <RecipeSlideEmpty />;

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
          {recipes.map((item) => (
            <CarouselItem key={item.id} className="basis-[200px] pl-3">
              <DetailedRecipeGridItem
                recipe={item}
                leftBadge={
                  <RecipeLikeButton
                    recipeId={item.id}
                    initialIsLiked={item.likedByCurrentUser}
                    initialLikeCount={item.likeCount}
                    buttonClassName="text-white"
                    iconClassName="fill-gray-300 opacity-80"
                  />
                }
                rightBadge={getRecipeRightBadge(item)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden cursor-pointer md:flex" />
        <CarouselNext className="-right-4 hidden cursor-pointer md:flex" />
      </Carousel>
    );
  };

  return (
    <div className="mt-2 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {to && (
          <Link
            href={to}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            더보기
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default RecipeSlide;
