"use client";

import { useState } from "react";

import { MessageCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/shadcn/dialog";
import { Button } from "@/shared/ui/shadcn/button";
import { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import useCreateCommentMutation from "@/features/comment-create/model/hooks";
import CommentInputForm from "./CommentInputForm";
import { useRecipeStatus } from "@/features/recipe-status";

type CommentInputModalProps = {
  author: User | undefined;
  commentId?: string;
};

const CommentInputModal = ({ author, commentId }: CommentInputModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { recipeId } = useRecipeStatus();
  const { createComment } = useCreateCommentMutation(recipeId);
  const { user } = useUserStore();

  const handleSubmit = (comment: string) => {
    if (!recipeId || !user?.id) return;

    createComment(
      {
        recipeId,
        comment,
        commentId,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-olive-light hover:bg-olive-light/90 fixed bottom-24 hidden h-14 w-14 rounded-full text-white shadow-lg md:flex"
          style={{ right: "max(1.5rem, calc((100vw - 896px) / 2 - 5rem))" }}
          aria-label="댓글 작성"
        >
          <MessageCircle size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {commentId ? `${author?.nickname}님에게 답글 남기기` : "댓글 작성"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CommentInputForm
            author={author}
            user={user}
            commentId={commentId}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentInputModal;
