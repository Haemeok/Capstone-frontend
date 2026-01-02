import { Comment } from "@/entities/comment";

import CommentMoreButton from "./CommentMoreButton";
import RecipeCommentCard from "./RecipeCommentCard";

type RecipeCommentsSectionProps = {
  comments: Omit<Comment, "likedByCurrentUser" | "likeCount">[];
};

export default function RecipeCommentsSection({
  comments,
}: RecipeCommentsSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">코멘트</h2>
        <CommentMoreButton
          text={comments.length > 0 ? "더 읽기" : "작성하기"}
        />
      </div>

      {comments.length > 0 ? (
        <RecipeCommentCard comment={comments[0]} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 py-4">
          <p className="text-sm text-gray-400">첫번째 댓글을 작성해보세요!</p>
        </div>
      )}
    </section>
  );
}
