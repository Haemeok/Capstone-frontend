"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";
import SaveButton from "@/shared/ui/SaveButton";

import { RECIPE_BOOK_QUERY_KEYS, type RecipeBook } from "@/entities/recipe-book";
import { getRecipeStatus } from "@/entities/recipe/model/api";
import { RecipeStatus } from "@/entities/recipe/model/types";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";

import { useToastStore } from "@/widgets/Toast";

import { useToggleRecipeSave } from "../model/hooks";
import { useSaveToastWithChange } from "../model/useSaveToastWithChange";

type RecipeSaveButtonProps = {
  recipeId: string;
  initialIsFavorite: boolean;
  buttonClassName?: string;
  iconClassName?: string;
  defaultColorClass?: string;
  selectedColorClass?: string;
  label?: string;
};

const RecipeSaveButton = ({
  recipeId,
  initialIsFavorite,
  buttonClassName,
  iconClassName,
  defaultColorClass,
  selectedColorClass,
  label,
}: RecipeSaveButtonProps) => {
  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const { checkAndTrigger } = useNotificationPermissionTrigger();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const { data: currentStatus } = useQuery<RecipeStatus>({
    queryKey: ["recipe-status", recipeId],
    queryFn: () => getRecipeStatus(recipeId),
    enabled: false,
  });

  const isFavorite =
    currentStatus?.favoriteByCurrentUser ?? initialIsFavorite;

  const { notifySaved, changeSheet } = useSaveToastWithChange(recipeId);

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
          const books = queryClient.getQueryData<RecipeBook[]>(
            RECIPE_BOOK_QUERY_KEYS.list()
          );
          const defaultBook = books?.find((b) => b.isDefault);
          notifySaved(defaultBook);
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

  return (
    <>
      <SaveButton
        className={buttonClassName}
        iconClassName={iconClassName}
        defaultColorClass={defaultColorClass}
        selectedColorClass={selectedColorClass}
        onClick={handleClick}
        isFavorite={isFavorite}
        label={label}
      />
      {changeSheet}
    </>
  );
};

export default RecipeSaveButton;
