"use client";

import { useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";
import HeartButton from "@/shared/ui/HeartButton";

import { RecipeStatus } from "@/entities/recipe/model/types";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";

import { useLikeRecipeMutation } from "../model/hooks";

type RecipeLikeButtonProps = {
  recipeId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  buttonClassName?: string;
  containerClassName?: string;
  iconClassName?: string;
  isCountShown?: boolean;
  isOnNavbar?: boolean;
  defaultColorClass?: string;
};

const RecipeLikeButton = ({
  recipeId,
  initialIsLiked,
  initialLikeCount,
  buttonClassName,
  containerClassName,
  iconClassName,
  isCountShown = false,
  isOnNavbar = false,
  defaultColorClass,
  ...props
}: RecipeLikeButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate: toggleLikeMutate } = useLikeRecipeMutation(recipeId);

  const { checkAndTrigger } = useNotificationPermissionTrigger();

  const currentStatus = queryClient.getQueryData<RecipeStatus>([
    "recipe-status",
    recipeId,
  ]);

  const isLiked = currentStatus?.likedByCurrentUser ?? initialIsLiked;
  const likeCount = currentStatus?.likeCount ?? initialLikeCount;

  const handleLikeClick = () => {
    if (!checkAndTrigger("like")) return;
    triggerHaptic("Light");
    toggleLikeMutate();
  };

  return (
    <HeartButton
      isLiked={isLiked}
      likeCount={likeCount}
      onClick={handleLikeClick}
      containerClassName={containerClassName}
      buttonClassName={buttonClassName}
      iconClassName={iconClassName}
      isCountShown={isCountShown}
      isOnNavbar={isOnNavbar}
      defaultColorClass={defaultColorClass}
      {...props}
    />
  );
};

export default RecipeLikeButton;
