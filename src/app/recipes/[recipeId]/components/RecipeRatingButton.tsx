"use client";

import { useRouter } from "next/navigation";

import { useUserStore } from "@/entities/user/model/store";
import Ratings from "@/shared/ui/Ratings";
import { useToastStore } from "@/widgets/Toast/model/store";

type RecipeRatingButtonProps = {
  avgRating: number;
  ratingCount: number;
  recipeId: number;
};

export default function RecipeRatingButton({
  avgRating,
  ratingCount,
  recipeId,
}: RecipeRatingButtonProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const { addToast } = useToastStore();

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
    <div onClick={handleRatingClick} className="mt-4 p-2 w-fit cursor-pointer">
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
