"use client";

import { Heart } from "lucide-react";

import {
  useRecipeDetailQuery,
  useRecipeStatusQuery,
} from "@/entities/recipe/model/hooks";
import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";
import { useToggleRecipeFavorite } from "@/features/recipe-favorite/model/hooks";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type DuplicateRecipeSectionProps = {
  recipeId: string;
  onSaveSuccess?: () => void;
};

const DuplicateRecipeSection = ({
  recipeId,
  onSaveSuccess,
}: DuplicateRecipeSectionProps) => {
  const { recipeData, isLoading } = useRecipeDetailQuery(recipeId);
  const { data: recipeStatus } = useRecipeStatusQuery(recipeId);
  const { mutate: toggleFavorite, isPending: isSaving } =
    useToggleRecipeFavorite(recipeId);

  const isFavorited =
    recipeStatus?.favoriteByCurrentUser ??
    recipeData?.favoriteByCurrentUser ??
    false;

  const handleSaveClick = () => {
    toggleFavorite(undefined, {
      onSuccess: () => {
        onSaveSuccess?.();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (!recipeData) {
    return null;
  }

  const detailedRecipeItem = {
    id: recipeData.id,
    title: recipeData.title,
    imageUrl: recipeData.imageUrl,
    authorName: recipeData.author.nickname,
    authorId: recipeData.author.id,
    profileImage: recipeData.author.profileImage,
    cookingTime: recipeData.cookingTime,
    createdAt: recipeData.createdAt ?? "",
    likeCount: recipeData.likeCount,
    likedByCurrentUser: recipeData.likedByCurrentUser,
    avgRating: recipeData.ratingInfo.avgRating,
    ratingCount: recipeData.ratingInfo.ratingCount,
    marketPrice: recipeData.marketPrice,
    ingredientCost: recipeData.totalIngredientCost,
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-dark text-xl font-bold">레시피가 이미 존재해요!</h3>
        <p className="text-sm text-gray-600">
          크레딧이 차감되지 않았어요. 이 레시피를 저장할까요?
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <DetailedRecipeGridItem recipe={detailedRecipeItem} priority />
      </div>

      <button
        onClick={handleSaveClick}
        disabled={isSaving || isFavorited}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all ${
          isFavorited
            ? "bg-olive-light cursor-not-allowed opacity-60"
            : "from-olive-light to-olive-medium bg-gradient-to-r hover:shadow-lg"
        }`}
      >
        <Heart
          size={20}
          className={isFavorited ? "fill-white" : ""}
          aria-hidden="true"
        />
        {isSaving
          ? "저장 중..."
          : isFavorited
            ? "이미 저장된 레시피예요"
            : "레시피 저장하기"}
      </button>
    </div>
  );
};

export default DuplicateRecipeSection;
