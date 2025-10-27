"use client";

import SaveButton from "@/shared/ui/SaveButton";
import ShareButton from "@/shared/ui/ShareButton";

import { Recipe } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user/model/store";

import { useToggleRecipeFavorite } from "@/features/recipe-favorite";
import RecipeLikeButton from "@/features/recipe-like/ui/RecipeLikeButton";
import { LockButton } from "@/features/recipe-visibility";

import { useToastStore } from "@/widgets/Toast";

type RecipeInteractionButtonsProps = {
  recipeId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  initialIsFavorite: boolean;
  initialIsPrivate: boolean;
  title: string;
  authorId: number;
};

const RecipeInteractionButtons = ({
  recipeId,
  initialIsLiked,
  initialLikeCount,
  initialIsFavorite,
  initialIsPrivate,
  title,
  authorId,
}: RecipeInteractionButtonsProps) => {
  const { mutate: toggleFavorite } = useToggleRecipeFavorite(recipeId);
  const { addToast } = useToastStore();
  const { user } = useUserStore();

  const handleToggleFavorite = () => {
    const message = initialIsFavorite
      ? "즐겨찾기에서 삭제했습니다."
      : "즐겨찾기에 추가했습니다.";

    toggleFavorite(undefined, {
      onSuccess: () => {
        addToast({
          message,
          variant: "success",
          position: "bottom",
        });
      },
      onError: () => {
        addToast({
          message,
          variant: "error",
          position: "bottom",
        });
      },
    });
  };

  return (
    <div className="flex justify-center gap-4">
      <RecipeLikeButton
        recipeId={recipeId}
        initialIsLiked={initialIsLiked}
        initialLikeCount={initialLikeCount}
        buttonClassName="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        isOnNavbar={false}
        isCountShown
      />
      <SaveButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="저장"
        isFavorite={initialIsFavorite}
        onClick={handleToggleFavorite}
      />
      <ShareButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="공유"
        text={`${title} 를 확인해보세요!`}
      />
      {authorId === user?.id && (
        <LockButton recipeId={recipeId} initialIsLocked={initialIsPrivate} />
      )}
    </div>
  );
};

export default RecipeInteractionButtons;
