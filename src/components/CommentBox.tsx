import { Avatar } from "@/components/ui/avatar";
import { Comment } from "@/type/comment";

type CommentProps = {
  comment: Comment;
};

const CommentBox = ({ comment }: CommentProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-full border-2">
            <img
              src={comment.user.imageURL}
              alt={comment.user.name}
              className="object-cover"
            />
          </Avatar>
          <p>{comment.user.name}</p>
        </div>
        <p className="text-sm">{comment.date}</p>
      </div>
      <p className="text-sm">{comment.content}</p>
    </div>
  );
};

export default CommentBox;
