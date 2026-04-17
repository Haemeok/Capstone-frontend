"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";
import SaveButton from "@/shared/ui/SaveButton";

import { useRecipeBooks } from "@/entities/recipe-book";
import { RecipeStatus } from "@/entities/recipe/model/types";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { ChangeBookSheet } from "@/features/recipe-book-change";

import { useToastStore } from "@/widgets/Toast";

import { useToggleRecipeSave } from "../model/hooks";

type RecipeSaveButtonProps = {
  recipeId: string;
  initialIsFavorite: boolean;
  buttonClassName?: string;
  iconClassName?: string;
  defaultColorClass?: string;
  label?: string;
};

const RecipeSaveButton = ({
  recipeId,
  initialIsFavorite,
  buttonClassName,
  iconClassName,
  defaultColorClass,
  label,
}: RecipeSaveButtonProps) => {
  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const { checkAndTrigger } = useNotificationPermissionTrigger();
  const { addToast } = useToastStore();
  const { data: books } = useRecipeBooks();
  const defaultBook = books?.find((b) => b.isDefault);

  const { data: currentStatus } = useQuery<RecipeStatus>({
    queryKey: ["recipe-status", recipeId],
    queryFn: () => Promise.reject(),
    enabled: false,
  });

  const isFavorite =
    currentStatus?.favoriteByCurrentUser ?? initialIsFavorite;

  const [changeOpen, setChangeOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | undefined>();

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

  const handleClick = () => {
    if (!checkAndTrigger("save")) return;
    triggerHaptic(isFavorite ? "Light" : "Success");

    toggleFavorite(undefined, {
      onSuccess: () => {
        if (isFavorite) {
          addToast({
            message: "저장을 해제했습니다.",
            variant: "success",
            position: "bottom",
          });
        } else {
          setCurrentBookId(defaultBook?.id);
          showSaveToast(defaultBook?.name);
        }
      },
      onError: () => {
        addToast({
          message: isFavorite ? "저장 해제 실패" : "저장 실패",
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
      <SaveButton
        className={buttonClassName}
        iconClassName={iconClassName}
        defaultColorClass={defaultColorClass}
        onClick={handleClick}
        isFavorite={isFavorite}
        label={label}
      />
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

export default RecipeSaveButton;
