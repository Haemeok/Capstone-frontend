import { Avatar } from "@/components/ui/avatar";
import { Comment } from "@/type/comment";
import { Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import ToggleIconButton from "./Button/ToggleIconButton";
import { useState } from "react";

type CommentProps = {
  comment: Comment;
  hideReplyButton?: boolean;
  onLikeToggle?: (isLiked: boolean) => void;
};

const CommentBox = ({
  comment,
  hideReplyButton = false,
  onLikeToggle,
}: CommentProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const handleReplyClick = () => {
    navigate(`${comment.id}`);
  };

  const handleLikeToggle = (active: boolean) => {
    setIsLiked(active);
    setLikeCount((prev) => (active ? prev + 1 : prev - 1));
    onLikeToggle?.(active);
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${"p-4 border rounded-lg"}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className={`border-2 "h-8 w-8"}`}>
            <img
              src={comment.user.imageURL}
              alt={comment.user.name}
              className="object-cover"
            />
          </Avatar>
          <div>
            <p className={`font-medium`}>{comment.user.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{comment.date}</p>
          <button className="ml-2 text-gray-400 cursor-pointer hover:text-gray-600">
            •••
          </button>
        </div>
      </div>
      <p className={`text-gray-800`}>{comment.content}</p>

      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1">
          <ToggleIconButton
            isActive={isLiked}
            onToggle={handleLikeToggle}
            icon={
              <Heart
                size={16}
                className="hover:fill-red-500 hover:scale-110 transition-all duration-250"
              />
            }
            activeIcon={
              <Heart
                size={16}
                className="fill-red-500 hover:scale-110 transition-all duration-250"
              />
            }
            activeClassName="text-red-500 fill-red-500"
            size="sm"
            variant="ghost"
          />
          <span className={`text-sm`}>{likeCount}</span>
        </div>

        {!hideReplyButton && (
          <button
            className="flex items-center gap-1 text-sm cursor-pointer group"
            onClick={handleReplyClick}
          >
            <MessageSquare
              size={16}
              className="group-hover:scale-120 transition-all duration-250 group-hover:fill-slate-500"
            />
            <span className={`text-sm`}>{comment.replyCount}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
