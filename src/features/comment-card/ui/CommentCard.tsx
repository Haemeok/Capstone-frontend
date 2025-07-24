"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MessageSquare, Trash } from "lucide-react";

import { formatTimeAgo } from "@/shared/lib/date";
import { DeleteModal } from "@/shared/ui/DeleteModal";

import { Comment } from "@/entities/comment";
import { useUserStore } from "@/entities/user";
import Username from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { useDeleteCommentMutation } from "@/features/comment-delete";
import CommentLikeButton from "@/features/comment-like/ui/CommentLikeButton";

type CommentProps = {
  comment: Comment;
  hideReplyButton?: boolean;
  recipeId: number;
};

const CommentCard = ({
  comment,
  hideReplyButton = false,
  recipeId,
}: CommentProps) => {
  const router = useRouter();
  const { user } = useUserStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleReplyClick = () => {
    router.push(`comments/${comment.id}`);
  };

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
    <div className="bg-beige flex w-full flex-col gap-2 rounded-2xl p-4">
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
              className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash size={15} />
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
          recipeId={recipeId.toString()}
        />

        {!hideReplyButton && (
          <button
            className="group flex cursor-pointer items-center gap-1 text-sm"
            onClick={handleReplyClick}
          >
            <MessageSquare
              size={16}
              className="transition-all duration-250 group-hover:scale-120 group-hover:fill-slate-500"
            />
            <span className={`text-sm font-semibold`}>
              {comment.replyCount}
            </span>
          </button>
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
