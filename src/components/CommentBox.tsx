import { Avatar } from '@/components/ui/avatar';
import { Comment } from '@/type/comment';
import { EllipsisVertical, MessageSquare, Trash } from 'lucide-react';
import { useNavigate } from 'react-router';
import CommentLikeButton from './comment/CommentLikeButton';
import SuspenseImage from './Image/SuspenseImage';
import { formatTimeAgo } from '@/utils/recipe';
import { useUserStore } from '@/store/useUserStore';
import { useState } from 'react';
import { DeleteModal } from './DeleteModal';
import useDeleteCommentMutation from '@/hooks/useDeleteCommentMutation';

type CommentProps = {
  comment: Comment;
  hideReplyButton?: boolean;
  recipeId: number;
};

const CommentBox = ({
  comment,
  hideReplyButton = false,
  recipeId,
}: CommentProps) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleReplyClick = () => {
    navigate(`${comment.id}`);
  };

  const { mutate: deleteComment } = useDeleteCommentMutation(
    comment.id,
    recipeId,
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
          <Avatar className={`h-8 w-8 border-2`}>
            <SuspenseImage
              src={comment.author.profileImage || ''}
              alt={comment.author.nickname}
              className="object-cover"
            />
          </Avatar>
          <div>
            <p className={`font-semibold`}>{comment.author.nickname}</p>
          </div>
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

export default CommentBox;
