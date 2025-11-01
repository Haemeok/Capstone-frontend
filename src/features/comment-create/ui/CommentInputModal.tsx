"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

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

type CommentInputModalProps = {
  author: User | undefined;
  commentId?: number;
};

const CommentInputModal = ({ author, commentId }: CommentInputModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { recipeId } = useParams();
  const { createComment } = useCreateCommentMutation(Number(recipeId));
  const { user } = useUserStore();

  const handleSubmit = (comment: string) => {
    if (!recipeId || !user?.id) return;

    createComment(
      {
        recipeId: Number(recipeId),
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
          className="hidden md:flex fixed bottom-6 right-6 h-14 w-14 rounded-full bg-olive text-white shadow-lg hover:bg-olive-dark"
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
