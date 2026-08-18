import Link from "next/link";

import { fetchRecipeCookingReviewsOnServer } from "@/entities/cooking-review/model/api.server";

type RecipeCookingReviewPreviewProps = {
  recipeId: string;
  fallbackReviewCount: number;
};

export const RecipeCookingReviewPreview = async ({
  recipeId,
  fallbackReviewCount,
}: RecipeCookingReviewPreviewProps) => {
  const response = await fetchRecipeCookingReviewsOnServer({
    recipeId,
    page: 0,
    size: 1,
    photoOnly: false,
  }).catch(() => ({
    totalCount: fallbackReviewCount,
    items: [],
    hasNext: false,
  }));
  const firstReview = response.items[0];

  return (
    <section aria-labelledby="cooking-review-preview-title" className="py-8">
      <div className="flex items-center justify-between">
        <h2
          id="cooking-review-preview-title"
          className="text-ink text-lg font-bold"
        >
          만들어봤어요 {response.totalCount}
        </h2>
        <Link
          href={`/recipes/${recipeId}/reviews`}
          className="text-ink-sub min-h-11 py-3 text-sm font-semibold"
        >
          전체 보기
        </Link>
      </div>
      {firstReview ? (
        <div className="mt-4 space-y-1">
          <p className="text-ink text-sm font-semibold">
            {firstReview.nickname}
          </p>
          <p className="text-ink-sub line-clamp-2 text-sm leading-6">
            {firstReview.content}
          </p>
        </div>
      ) : null}
    </section>
  );
};
