"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { useInputFocusStore } from "@/shared/store/useInputFocusStore";

import { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import useCreateCommentMutation from "@/features/comment-create/model/hooks";
import { useRecipeStatus } from "@/features/recipe-status";

import CommentInputForm from "./CommentInputForm";

type CommentInputProps = {
  author: User | undefined;
  commentId?: string;
};

const CommentInput = ({ author, commentId }: CommentInputProps) => {
  const { recipeId } = useRecipeStatus();
  const { createComment } = useCreateCommentMutation(recipeId);
  const { user } = useUserStore();
  const { setInputFocused } = useInputFocusStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (comment: string) => {
    if (!recipeId || !user?.id) return;

    createComment({
      recipeId,
      comment,
      commentId,
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setInputFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setInputFocused(false);
  };

  return (
    <div
      className={cn(
        "fixed right-0 left-0 mx-4 rounded-2xl border-t bg-white px-2 py-1 shadow-md md:hidden",
        !isFocused && "bottom-20"
      )}
      style={isFocused ? { bottom: "var(--keyboard-height, 0px)" } : undefined}
    >
      <div className="mx-auto max-w-3xl">
        <CommentInputForm
          author={author}
          user={user}
          commentId={commentId}
          onSubmit={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default CommentInput;
