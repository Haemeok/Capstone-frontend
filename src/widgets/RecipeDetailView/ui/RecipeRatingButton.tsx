"use client";

import { useLocalizedRouter, useT } from "@/shared/i18n";
import Ratings from "@/shared/ui/Ratings";
import { useToastStore } from "@/shared/ui/toast/model/store";

import { useUserStore } from "@/entities/user/model/store";

import { useRecipeStatus } from "@/features/recipe-status";

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
  const t = useT();

  const router = useLocalizedRouter();

  const handleRatingClick = () => {
    if (!user) {
      addToast({
        message: t.common.loginRequired,
        variant: "default",
        position: "bottom",
      });
      return;
    }

    router.push(`/recipes/${recipeId}/rate`);
  };

  return (
    <div
      onClick={handleRatingClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleRatingClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={t.recipeDetail.rateAria}
      className="mt-4 w-fit cursor-pointer p-2"
    >
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
