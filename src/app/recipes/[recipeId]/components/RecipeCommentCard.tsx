"use client";

import { CommentCard } from "@/features/comment-card";

import { Comment } from "@/entities/comment";

import { useRecipeStatus } from "./RecipeStatusProvider";

type RecipeCommentCardProps = {
  comment: Omit<Comment, "likedByCurrentUser" | "likeCount">;
  recipeId: number;
};

export default function RecipeCommentCard({
  comment,
  recipeId,
}: RecipeCommentCardProps) {
  const { status } = useRecipeStatus();

  const statusComment = status?.comments.find((c) => c.id === comment.id);
  const fullComment: Comment = {
    ...comment,
    likedByCurrentUser: statusComment?.likedByCurrentUser ?? false,
    likeCount: statusComment?.likeCount ?? 0,
  };

  return (
    <CommentCard comment={fullComment} recipeId={recipeId} hideReplyButton />
  );
}
