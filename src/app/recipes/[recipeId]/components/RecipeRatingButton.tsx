"use client";

import { useRouter } from "next/navigation";

import Ratings from "@/shared/ui/Ratings";

import { useUserStore } from "@/entities/user/model/store";

import { useRecipeStatus } from "@/features/recipe-status";

import { useToastStore } from "@/widgets/Toast/model/store";

type RecipeRatingButtonProps = {
  avgRating: number;
  ratingCount: number;
};

export default function RecipeRatingButton({
  avgRating,
  ratingCount,
}: RecipeRatingButtonProps) {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const { recipeId } = useRecipeStatus();

  const router = useRouter();

  const handleRatingClick = () => {
    if (!user) {
      addToast({
        message: "로그인이 필요합니다.",
        variant: "default",
        position: "bottom",
      });
      return;
    }

    router.push(`/recipes/${recipeId}/rate`);
  };

  return (
    <div onClick={handleRatingClick} className="mt-4 w-fit cursor-pointer p-2">
      <Ratings
        precision={0.1}
        allowHalf
        value={avgRating || 0}
        readOnly
        className="w-full justify-center"
        showValue
        ratingCount={ratingCount}
      />
    </div>
  );
}
