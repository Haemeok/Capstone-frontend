import { useLikeRecipeMutation } from '@/hooks/useLikeRecipeMutation';
import HeartButton from '@/components/Button/HeartButton';

type RecipeLikeButtonProps = {
  recipeId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  buttonClassName?: string;
  containerClassName?: string;
  isCountShown?: boolean;
};

const RecipeLikeButton = ({
  recipeId,
  initialIsLiked,
  initialLikeCount,
  buttonClassName,
  containerClassName,
  isCountShown = false,
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
      isCountShown={isCountShown}
      {...props}
    />
  );
};

export default RecipeLikeButton;
