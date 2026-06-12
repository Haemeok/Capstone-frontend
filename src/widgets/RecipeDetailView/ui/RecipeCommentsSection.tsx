import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";

import { Comment } from "@/entities/comment";

import CommentMoreButton from "./CommentMoreButton";
import RecipeCommentCard from "./RecipeCommentCard";

type RecipeCommentsSectionProps = {
  comments: Omit<Comment, "likedByCurrentUser" | "likeCount">[];
  locale: Locale;
};

export default function RecipeCommentsSection({
  comments,
  locale,
}: RecipeCommentsSectionProps) {
  const t = getDictionary(locale);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.recipeDetail.commentsHeading}</h2>
        <CommentMoreButton
          text={
            comments.length > 0
              ? t.recipeDetail.commentsReadMore
              : t.recipeDetail.commentsWrite
          }
        />
      </div>

      {comments.length > 0 ? (
        <RecipeCommentCard comment={comments[0]} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 py-4">
          <p className="text-sm text-gray-400">
            {t.recipeDetail.commentsEmpty}
          </p>
        </div>
      )}
    </section>
  );
}
