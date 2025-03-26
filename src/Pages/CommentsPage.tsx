import { comments } from "@/mock";
import CommentBox from "@/components/CommentBox";

const CommentsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentBox key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsPage;
