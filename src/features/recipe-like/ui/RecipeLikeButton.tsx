"use client";

import { useQueryClient } from "@tanstack/react-query";

import HeartButton from "@/shared/ui/HeartButton";

import { Recipe } from "@/entities/recipe/model/types";

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
  ...props
}: RecipeLikeButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate: toggleLikeMutate } = useLikeRecipeMutation(recipeId);

  const currentRecipe = queryClient.getQueryData<Recipe>([
    "recipe",
    recipeId.toString(),
  ]);

  const isLiked = currentRecipe?.likedByCurrentUser ?? initialIsLiked;
  const likeCount = currentRecipe?.likeCount ?? initialLikeCount;

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
      {...props}
    />
  );
};

export default RecipeLikeButton;
