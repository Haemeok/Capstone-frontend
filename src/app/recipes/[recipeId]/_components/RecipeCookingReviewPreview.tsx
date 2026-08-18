import Link from "next/link";

import { fetchRecipeCookingReviewsOnServer } from "@/entities/cooking-review/model/api.server";
import type { PublicCookingReviewsResponse } from "@/entities/cooking-review/model/types";

import { RecipeCookingReviewPreviewContent } from "./RecipeCookingReviewPreviewContent";

type RecipeCookingReviewPreviewProps = {
  recipeId: string;
  fallbackReviewCount: number;
};

export const RecipeCookingReviewPreview = async ({
  recipeId,
  fallbackReviewCount,
}: RecipeCookingReviewPreviewProps) => {
  const [summaryResult, photoResult] = await Promise.allSettled([
    fetchRecipeCookingReviewsOnServer({
      recipeId,
      page: 0,
      size: 1,
      photoOnly: false,
    }),
    fetchRecipeCookingReviewsOnServer({
      recipeId,
      page: 0,
      size: 3,
      photoOnly: true,
    }),
  ]);
  const fallbackResponse: PublicCookingReviewsResponse = {
    totalCount: fallbackReviewCount,
    items: [],
    hasNext: false,
  };
  const summaryResponse =
    summaryResult.status === "fulfilled"
      ? summaryResult.value
      : fallbackResponse;
  const photoResponse =
    photoResult.status === "fulfilled" ? photoResult.value : undefined;

  return (
    <section aria-labelledby="cooking-review-preview-title" className="py-8">
      <div className="flex items-center justify-between">
        <h2
          id="cooking-review-preview-title"
          className="text-ink text-lg font-bold"
        >
          만들어봤어요 {summaryResponse.totalCount}
        </h2>
        <Link
          href={`/recipes/${recipeId}/reviews`}
          className="text-ink-sub min-h-11 py-3 text-sm font-semibold"
        >
          전체 보기
        </Link>
      </div>
      <RecipeCookingReviewPreviewContent
        recipeId={recipeId}
        firstReview={summaryResponse.items[0]}
        photoResponse={photoResponse}
      />
    </section>
  );
};
