import HeartButton from "@/shared/ui/HeartButton";

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
  const { mutate: toggleLikeMutate, isPending } =
    useLikeRecipeMutation(recipeId);

  return (
    <HeartButton
      isLiked={initialIsLiked}
      likeCount={initialLikeCount}
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
