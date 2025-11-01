"use client";

import { useParams } from "next/navigation";

import { useInputFocusStore } from "@/shared/store/useInputFocusStore";
import { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import useCreateCommentMutation from "@/features/comment-create/model/hooks";
import CommentInputForm from "./CommentInputForm";

type CommentInputProps = {
  author: User | undefined;
  commentId?: number;
};

const CommentInput = ({ author, commentId }: CommentInputProps) => {
  const { recipeId } = useParams();
  const { createComment } = useCreateCommentMutation(Number(recipeId));
  const { user } = useUserStore();
  const { setInputFocused } = useInputFocusStore();

  const handleSubmit = (comment: string) => {
    if (!recipeId || !user?.id) return;

    createComment({
      recipeId: Number(recipeId),
      comment,
      commentId,
    });
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  return (
    <div className="md:hidden fixed right-0 bottom-20 left-0 mx-4 rounded-2xl border-t bg-white px-2 py-1 shadow-md">
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
