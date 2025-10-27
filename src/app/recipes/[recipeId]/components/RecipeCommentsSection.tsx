import Box from "@/shared/ui/primitives/Box";

import { Comment } from "@/entities/comment";

import CommentMoreButton from "./CommentMoreButton";
import RecipeCommentCard from "./RecipeCommentCard";

type RecipeCommentsSectionProps = {
  comments: Omit<Comment, "likedByCurrentUser" | "likeCount">[];
  recipeId: number;
};

export default function RecipeCommentsSection({
  comments,
  recipeId,
}: RecipeCommentsSectionProps) {
  return (
    <Box>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">코멘트</h2>
        <CommentMoreButton
          recipeId={recipeId}
          text={comments.length > 0 ? "더 읽기" : "작성하기"}
        />
      </div>

      {comments.length > 0 ? (
        <RecipeCommentCard comment={comments[0]} recipeId={recipeId} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 mt-4">
          <p className="text-sm text-gray-400">첫번째 댓글을 작성해보세요!</p>
        </div>
      )}
    </Box>
  );
}
