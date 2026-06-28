"use client";

import { useState } from "react";
import Link from "next/link";

import { MessageSquare, Trash } from "lucide-react";

import { useCommentsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { formatTimeAgo } from "@/shared/lib/date";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import { Comment } from "@/entities/comment";
import { useUserStore } from "@/entities/user";
import Username from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { useDeleteCommentMutation } from "@/features/comment-delete";
import CommentLikeButton from "@/features/comment-like/ui/CommentLikeButton";
import { useRecipeStatus } from "@/features/recipe-status";

import CommentImage from "./CommentImage";

type CommentProps = {
  comment: Comment;
  hideReplyButton?: boolean;
};

const CommentCard = ({ comment, hideReplyButton = false }: CommentProps) => {
  const { user } = useUserStore();
  const t = useCommentsDict();
  const { recipeId } = useRecipeStatus();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteComment } = useDeleteCommentMutation(
    comment.id,
    recipeId
  );

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    deleteComment();
  };

  const formattedDate = formatTimeAgo(comment.createdAt);

  const [showOriginal, setShowOriginal] = useState(false);
  const canToggleOriginal = Boolean(
    comment.translated && comment.originalContent
  );
  const displayedContent =
    showOriginal && comment.originalContent
      ? comment.originalContent
      : comment.content;
  const languageName = comment.sourceLocale
    ? t.languageNames[comment.sourceLocale]
    : undefined;

  const handleToggleOriginal = () => {
    triggerHaptic("Light");
    setShowOriginal((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserProfileImage
            profileImage={comment.author.profileImage || ""}
            userId={comment.author.id}
            className="h-8 w-8"
          />
          <Username
            username={comment.author.nickname}
            userId={comment.author.id}
          />
        </div>
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{formattedDate}</p>
          {user?.id === comment.author.id && (
            <button
              className="hover:text-ink-sub ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label={t.deleteAria}
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="text-ink">{displayedContent}</p>
      {canToggleOriginal && (
        <div className="text-ink-muted flex items-center gap-1.5 text-xs">
          {!showOriginal && languageName && (
            <>
              <span>
                {t.translatedFrom.replace("{language}", languageName)}
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          <button
            type="button"
            onClick={handleToggleOriginal}
            className="cursor-pointer font-medium hover:underline"
          >
            {showOriginal ? t.showTranslation : t.showOriginal}
          </button>
        </div>
      )}
      {comment.imageUrls && comment.imageUrls.length > 0 && (
        <CommentImage urls={comment.imageUrls} />
      )}

      <div className="mt-1 flex items-center gap-4">
        <CommentLikeButton
          commentId={comment.id}
          initialIsLiked={comment.likedByCurrentUser}
          initialLikeCount={comment.likeCount}
          recipeId={recipeId}
        />

        {!hideReplyButton && (
          <Link
            href={`comments/${comment.id}`}
            prefetch={false}
            className="group text-ink-muted flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-sm transition-colors hover:bg-gray-100"
          >
            <MessageSquare
              size={16}
              className="transition-all duration-250 group-hover:scale-110"
            />
            <span className="text-sm font-medium">{comment.replyCount}</span>
          </Link>
        )}
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title={t.deleteModalTitle}
          onConfirm={handleDelete}
          description={t.deleteModalDesc}
        />
      )}
    </div>
  );
};

export default CommentCard;
