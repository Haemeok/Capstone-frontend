"use client";

import { useState } from "react";

import Link from "next/link";

import { Pencil } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import SaveButton from "@/shared/ui/SaveButton";
import ShareButton from "@/shared/ui/ShareButton";

import { useRecipeBooks } from "@/entities/recipe-book";
import { useUserStore } from "@/entities/user";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { ChangeBookSheet } from "@/features/recipe-book-change";
import { useToggleRecipeSave } from "@/features/recipe-save";

import { useToastStore } from "@/widgets/Toast";

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
  initialIsPrivate,
  title,
  authorId,
}: RecipeInteractionButtonsProps) => {
  const { user } = useUserStore();
  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const { addToast } = useToastStore();
  const { checkAndTrigger } = useNotificationPermissionTrigger();
  const { data: books } = useRecipeBooks();
  const defaultBook = books?.find((b) => b.isDefault);

  const [changeOpen, setChangeOpen] = useState(false);
  // Tracks where the recipe currently lives — starts at default book,
  // updates after each successful move so chained "변경" toasts work.
  const [currentBookId, setCurrentBookId] = useState<string | undefined>();

  const isOwner = user?.id === authorId;

  const showSaveToast = (bookName: string | undefined) => {
    addToast({
      message: bookName
        ? `${bookName}에 저장되었습니다.`
        : `"저장된 레시피"에 보관되었습니다.`,
      variant: "action",
      position: "bottom",
      action: {
        label: "변경",
        onClick: () => setChangeOpen(true),
      },
    });
  };

  const handleToggleFavorite = () => {
    if (!checkAndTrigger("save")) return;
    triggerHaptic("Medium");

    toggleFavorite(undefined, {
      onSuccess: () => {
        if (initialIsFavorite) {
          addToast({
            message: "저장을 해제했습니다.",
            variant: "success",
            position: "bottom",
          });
        } else {
          // Reset chain to default book whenever a fresh save happens
          setCurrentBookId(defaultBook?.id);
          showSaveToast(defaultBook?.name);
        }
      },
      onError: () => {
        const message = initialIsFavorite
          ? "저장을 해제했습니다."
          : "저장했습니다.";
        addToast({
          message,
          variant: "error",
          position: "bottom",
        });
      },
    });
  };

  const handleMoveComplete = (toBookId: string, toBookName: string) => {
    setCurrentBookId(toBookId);
    showSaveToast(toBookName);
  };

  return (
    <>
      <div className="flex justify-center gap-4">
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
          title={`${title} - 레시피오`}
          text={`${title} 레시피를 확인해보세요!`}
        />
      </div>
      <ChangeBookSheet
        open={changeOpen}
        onOpenChange={setChangeOpen}
        recipeId={recipeId}
        fromBookId={currentBookId}
        onMoveComplete={handleMoveComplete}
      />
    </>
  );
};

export default RecipeInteractionButtons;
