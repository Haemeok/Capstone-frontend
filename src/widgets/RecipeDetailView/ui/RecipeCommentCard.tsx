"use client";

import { Comment } from "@/entities/comment";

import { CommentCard } from "@/features/comment-card";
import { useRecipeStatus } from "@/features/recipe-status";

type RecipeCommentCardProps = {
  comment: Omit<Comment, "likedByCurrentUser" | "likeCount">;
};

export default function RecipeCommentCard({ comment }: RecipeCommentCardProps) {
  const { status } = useRecipeStatus();

  const statusComment = status?.comments.find((c) => c.id === comment.id);
  const fullComment: Comment = {
    ...comment,
    likedByCurrentUser: statusComment?.likedByCurrentUser ?? false,
    likeCount: statusComment?.likeCount ?? 0,
  };

  return <CommentCard comment={fullComment} hideReplyButton />;
}
