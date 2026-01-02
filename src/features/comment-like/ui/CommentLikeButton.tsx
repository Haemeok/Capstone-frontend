"use client";

import HeartButton from "@/shared/ui/HeartButton";

import { useLikeCommentMutation } from "@/features/comment-like";

type CommentLikeButtonProps = {
  commentId: string;
  recipeId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
};

const CommentLikeButton = ({
  commentId,
  recipeId,
  initialIsLiked,
  initialLikeCount,
}: CommentLikeButtonProps) => {
  const { mutate: toggleLikeMutate } = useLikeCommentMutation(
    commentId,
    recipeId
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
      isCountShown
      width={16}
      height={16}
    />
  );
};

export default CommentLikeButton;
