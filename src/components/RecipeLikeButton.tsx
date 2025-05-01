import { useLikeRecipeMutation } from '@/hooks/useLikeRecipeMutation';
import HeartButton from '@/components/Button/HeartButton';

type RecipeLikeButtonProps = {
  recipeId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
};

const RecipeLikeButton = ({
  recipeId,
  initialIsLiked,
  initialLikeCount,
}: RecipeLikeButtonProps) => {
  const { mutate: toggleLikeMutate, isPending } =
    useLikeRecipeMutation(recipeId);

  const handleClick = () => {
    toggleLikeMutate();
  };

  return (
    <HeartButton
      isLiked={initialIsLiked}
      likeCount={initialLikeCount}
      onClick={handleClick}
      containerClassName="flex-row"
      buttonClassName="flex items-center gap-1 text-sm cursor-pointer group w-5 h-5"
      isCountShown={true}
      width={16}
      height={16}
    />
  );
};

export default RecipeLikeButton;
