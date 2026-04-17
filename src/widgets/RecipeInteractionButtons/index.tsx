"use client";

import Link from "next/link";

import { Pencil } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import ShareButton from "@/shared/ui/ShareButton";

import { useUserStore } from "@/entities/user";

import { RecipeSaveButton } from "@/features/recipe-save";

type RecipeInteractionButtonsProps = {
  recipeId: string;
  initialIsFavorite: boolean;
  initialIsPrivate: boolean;
  title: string;
  authorId: string;
};

const RecipeInteractionButtons = ({
  recipeId,
  initialIsFavorite,
  title,
  authorId,
}: RecipeInteractionButtonsProps) => {
  const { user } = useUserStore();

  const isOwner = user?.id === authorId;

  return (
    <div className="flex justify-center gap-4">
      <RecipeSaveButton
        recipeId={recipeId}
        initialIsFavorite={initialIsFavorite}
        buttonClassName="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="저장"
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
        title={`${title} - 레시피오`}
        text={`${title} 레시피를 확인해보세요!`}
      />
    </div>
  );
};

export default RecipeInteractionButtons;
