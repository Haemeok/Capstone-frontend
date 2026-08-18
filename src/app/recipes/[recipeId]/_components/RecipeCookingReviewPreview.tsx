"use client";

import Link from "next/link";

import { cookingReviewPreviewMessages } from "@/shared/i18n";

import { useRecipeCookingReviews } from "@/entities/cooking-review";

import { RecipeCookingReviewPreviewContent } from "./RecipeCookingReviewPreviewContent";

type RecipeCookingReviewPreviewProps = {
  recipeId: string;
};

export const RecipeCookingReviewPreview = ({
  recipeId,
}: RecipeCookingReviewPreviewProps) => {
  const copy = cookingReviewPreviewMessages.ko;
  const summaryQuery = useRecipeCookingReviews({
    recipeId,
    photoOnly: false,
    size: 1,
    locale: "ko",
    enabled: true,
  });
  const photoQuery = useRecipeCookingReviews({
    recipeId,
    photoOnly: true,
    size: 3,
    locale: "ko",
    enabled: true,
  });
  const summary = summaryQuery.data?.pages[0];
  const photos = photoQuery.data?.pages[0];
  const reviewCount =
    summary && summary.totalCount > 0 ? ` ${summary.totalCount}` : "";

  return (
    <section aria-labelledby="cooking-review-preview-title" className="py-8">
      <div className="flex items-center justify-between">
        <h2
          id="cooking-review-preview-title"
          className="text-ink text-lg font-bold"
        >
          {copy.heading}
          {reviewCount}
        </h2>
        <Link
          href={`/recipes/${recipeId}/reviews`}
          className="text-ink-muted min-h-11 py-3 text-sm font-normal"
        >
          {copy.viewAll}
        </Link>
      </div>
      {summaryQuery.isPending ? (
        <div
          role="status"
          aria-label={copy.loading}
          className="mt-4 h-[76px] animate-pulse rounded-2xl bg-gray-50"
        />
      ) : null}
      {summary && !summaryQuery.isError ? (
        <RecipeCookingReviewPreviewContent
          recipeId={recipeId}
          firstReview={summary.items[0]}
          photoResponse={photos}
          emptyTitle={copy.emptyTitle}
          emptyDescription={copy.emptyDescription}
        />
      ) : null}
    </section>
  );
};
