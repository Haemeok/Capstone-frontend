import { Avatar } from '@/components/ui/avatar';
import { Comment } from '@/type/comment';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';
import CommentLikeButton from './comment/CommentLikeButton';
import SuspenseImage from './Image/SuspenseImage';
import { formatTimeAgo } from '@/utils/recipe';
type CommentProps = {
  comment: Comment;
  hideReplyButton?: boolean;
};

const CommentBox = ({ comment, hideReplyButton = false }: CommentProps) => {
  const navigate = useNavigate();

  const handleReplyClick = () => {
    navigate(`${comment.id}`);
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
          <button className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600">
            •••
          </button>
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
    </div>
  );
};

export default CommentBox;
