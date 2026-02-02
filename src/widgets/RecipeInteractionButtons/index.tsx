"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { useUserStore } from "@/entities/user";

import { triggerHaptic } from "@/shared/lib/bridge";
import SaveButton from "@/shared/ui/SaveButton";
import ShareButton from "@/shared/ui/ShareButton";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { useToggleRecipeFavorite } from "@/features/recipe-favorite";
import RecipeLikeButton from "@/features/recipe-like/ui/RecipeLikeButton";

import { useToastStore } from "@/widgets/Toast";

type RecipeInteractionButtonsProps = {
  recipeId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  initialIsFavorite: boolean;
  initialIsPrivate: boolean;
  title: string;
  authorId: string;
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
  const { user } = useUserStore();
  const { mutate: toggleFavorite } = useToggleRecipeFavorite(recipeId);
  const { addToast } = useToastStore();
  const { checkAndTrigger } = useNotificationPermissionTrigger();

  const isOwner = user?.id === authorId;

  const handleToggleFavorite = () => {
    if (!checkAndTrigger("save")) return;
    triggerHaptic("Medium");

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
        defaultColorClass="text-gray-900"
        isOnNavbar={false}
        isCountShown
      />
      <SaveButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="저장"
        isFavorite={initialIsFavorite}
        onClick={handleToggleFavorite}
      />
      {isOwner && (
        <div className="flex flex-col items-center">
          <Link
            href={`/recipes/${recipeId}/edit`}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
            aria-label="레시피 수정"
            onClick={() => triggerHaptic("Light")}
          >
            <Pencil width={24} height={24} />
          </Link>
          <p className="mt-1 text-sm font-bold">수정</p>
        </div>
      )}
      <ShareButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="공유"
        text={`${title} 를 확인해보세요!`}
      />
      
    </div>
  );
};

export default RecipeInteractionButtons;
