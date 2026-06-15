"use client";

import { useState } from "react";

import { MessageCircle } from "lucide-react";

import { format, useCommentsDict } from "@/shared/i18n";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/shadcn/dialog";

import { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import useCreateCommentMutation from "@/features/comment-create/model/hooks";
import { useRecipeStatus } from "@/features/recipe-status";

import CommentInputForm from "./CommentInputForm";

type CommentInputModalProps = {
  author: User | undefined;
  commentId?: string;
};

const CommentInputModal = ({ author, commentId }: CommentInputModalProps) => {
  const t = useCommentsDict();
  const [isOpen, setIsOpen] = useState(false);
  const { recipeId } = useRecipeStatus();
  const { createComment, isPending } = useCreateCommentMutation(recipeId);
  const { user } = useUserStore();

  const handleSubmit = (comment: string, file: File | null) => {
    if (!recipeId || !user?.id) return;

    createComment(
      {
        recipeId,
        comment,
        commentId,
        file: file ?? undefined,
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
          aria-label={t.modalTriggerAria}
        >
          <MessageCircle size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {commentId
              ? format(t.modalReplyTitle, { nickname: author?.nickname ?? "" })
              : t.modalCommentTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CommentInputForm
            author={author}
            user={user}
            commentId={commentId}
            enableImage={false}
            isSubmitting={isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentInputModal;
