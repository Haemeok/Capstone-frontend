"use client";

import { useQuery } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";
import SaveButton from "@/shared/ui/SaveButton";

import { RecipeStatus } from "@/entities/recipe/model/types";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";

import { useToggleRecipeSave } from "../model/hooks";

type RecipeSaveButtonProps = {
  recipeId: string;
  initialIsFavorite: boolean;
  buttonClassName?: string;
  label?: string;
};

const RecipeSaveButton = ({
  recipeId,
  initialIsFavorite,
  buttonClassName,
  label,
}: RecipeSaveButtonProps) => {
  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const { checkAndTrigger } = useNotificationPermissionTrigger();

  const { data: currentStatus } = useQuery<RecipeStatus>({
    queryKey: ["recipe-status", recipeId],
    queryFn: () => Promise.reject(),
    enabled: false,
  });

  const isFavorite =
    currentStatus?.favoriteByCurrentUser ?? initialIsFavorite;

  const handleClick = () => {
    if (!checkAndTrigger("save")) return;
    triggerHaptic(isFavorite ? "Light" : "Success");
    toggleFavorite();
  };

  return (
    <SaveButton
      className={buttonClassName}
      onClick={handleClick}
      isFavorite={isFavorite}
      label={label}
    />
  );
};

export default RecipeSaveButton;
