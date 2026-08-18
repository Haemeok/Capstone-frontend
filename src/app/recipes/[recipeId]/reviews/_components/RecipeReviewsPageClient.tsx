"use client";

import PrevButton from "@/shared/ui/PrevButton";

import { useRecipeCookingReviews } from "@/entities/cooking-review";

import { RecipeReviewCard } from "./RecipeReviewCard";

type RecipeReviewsPageClientProps = {
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  saveAmount: number;
};

export const RecipeReviewsPageClient = ({
  recipeId,
}: RecipeReviewsPageClientProps) => {
  const { data } = useRecipeCookingReviews({
    recipeId,
    photoOnly: false,
    size: 20,
    locale: "ko",
    enabled: true,
  });
  const reviews = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12">
      <header className="relative flex min-h-14 items-center justify-center">
        <PrevButton
          size={22}
          showOnDesktop
          className="absolute left-0 size-11"
        />
        <h1 className="text-ink text-lg font-bold">만들어봤어요</h1>
      </header>
      <main className="pt-5">
        <p className="text-ink text-base font-bold">전체 {totalCount}개</p>
        <div className="mt-7 space-y-8">
          {reviews.map((review) => (
            <RecipeReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      </main>
    </div>
  );
};
