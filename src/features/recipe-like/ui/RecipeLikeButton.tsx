"use client";

import { useQueryClient } from "@tanstack/react-query";

import HeartButton from "@/shared/ui/HeartButton";

import { RecipeStatus } from "@/entities/recipe/model/types";

import { useLikeRecipeMutation } from "../model/hooks";

type RecipeLikeButtonProps = {
  recipeId: number;
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

  const currentStatus = queryClient.getQueryData<RecipeStatus>([
    "recipe-status",
    recipeId.toString(),
  ]);

  const isLiked = currentStatus?.likedByCurrentUser ?? initialIsLiked;
  const likeCount = currentStatus?.likeCount ?? initialLikeCount;

  return (
    <HeartButton
      isLiked={isLiked}
      likeCount={likeCount}
      onClick={toggleLikeMutate}
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
