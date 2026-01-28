"use client";

import { useState } from "react";
import Link from "next/link";

import { MessageSquare, Trash } from "lucide-react";

import { formatTimeAgo } from "@/shared/lib/date";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import { Comment } from "@/entities/comment";
import { useUserStore } from "@/entities/user";
import Username from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { useDeleteCommentMutation } from "@/features/comment-delete";
import CommentLikeButton from "@/features/comment-like/ui/CommentLikeButton";
import { useRecipeStatus } from "@/features/recipe-status";

type CommentProps = {
  comment: Comment;
  hideReplyButton?: boolean;
};

const CommentCard = ({ comment, hideReplyButton = false }: CommentProps) => {
  const { user } = useUserStore();
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
              className="ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="댓글 삭제"
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>
      <p className={`text-[#2a2229]`}>{comment.content}</p>

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
            className="group flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100"
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
          title="댓글을 삭제하시겠어요?"
          onConfirm={handleDelete}
          description="이 댓글을 삭제하면 복구할 수 없습니다."
        />
      )}
    </div>
  );
};

export default CommentCard;
