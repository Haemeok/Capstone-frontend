"use client";

import SaveButton from "@/shared/ui/SaveButton";

import { Recipe } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user/model/store";

import { useToggleRecipeFavorite } from "@/features/recipe-favorite";
import RecipeLikeButton from "@/features/recipe-like/ui/RecipeLikeButton";
import { LockButton } from "@/features/recipe-visibility";
import ShareButton from "@/features/share-content/ui/ShareButton";

import { useToastStore } from "@/widgets/Toast";

interface RecipeInteractionButtonsProps {
  recipe: Recipe;
}

export default function RecipeInteractionButtons({
  recipe,
}: RecipeInteractionButtonsProps) {
  const { mutate: toggleFavorite } = useToggleRecipeFavorite(recipe.id);
  const { addToast } = useToastStore();
  const { user } = useUserStore();

  const handleToggleFavorite = () => {
    const message = recipe.favoriteByCurrentUser
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
        recipeId={recipe.id}
        initialIsLiked={recipe.likedByCurrentUser}
        initialLikeCount={recipe.likeCount}
        buttonClassName="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        isOnNavbar={false}
        isCountShown={true}
      />
      <SaveButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="저장"
        isFavorite={recipe.favoriteByCurrentUser}
        onClick={handleToggleFavorite}
      />
      <ShareButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="공유"
        text={`${recipe.title} 를 확인해보세요!`}
      />
      {recipe.author.id === user?.id && (
        <LockButton recipeId={recipe.id} initialIsLocked={recipe.private} />
      )}
    </div>
  );
}
