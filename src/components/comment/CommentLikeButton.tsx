import { useLikeCommentMutation } from '@/hooks/useLikeCommentMutation';
import HeartButton from '../Button/HeartButton';
import { useParams } from 'react-router';

type CommentLikeButtonProps = {
  commentId: number;

  initialIsLiked: boolean;
  initialLikeCount: number;
};

const CommentLikeButton = ({
  commentId,
  initialIsLiked,
  initialLikeCount,
}: CommentLikeButtonProps) => {
  const { recipeId } = useParams();
  const { mutate: toggleLikeMutate, isPending } = useLikeCommentMutation(
    commentId,
    recipeId,
  );

  const handleClick = () => {
    toggleLikeMutate();
  };

  return (
    <HeartButton
      isLiked={initialIsLiked}
      likeCount={initialLikeCount}
      onClick={handleClick}
      containerClassName="flex-row"
      buttonClassName="flex items-center gap-1 text-sm cursor-pointer group w-5 h-5 text-dark"
      isCountShown={true}
      width={16}
      height={16}
    />
  );
};

export default CommentLikeButton;
