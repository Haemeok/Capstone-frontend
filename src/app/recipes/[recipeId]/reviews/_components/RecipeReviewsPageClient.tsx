"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { triggerHaptic } from "@/shared/lib/bridge";
import PrevButton from "@/shared/ui/PrevButton";

import { useRecipeCookingReviews } from "@/entities/cooking-review";

import { PhotoReviewFilterChip } from "./PhotoReviewFilterChip";
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
  const [photoOnly, setPhotoOnly] = useState(false);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useRecipeCookingReviews({
    recipeId,
    photoOnly,
    size: 20,
    locale: "ko",
    enabled: true,
  });
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: "240px" });
  const reviews = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const handleRetry = () => {
    triggerHaptic("Light");
    void refetch();
  };

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
        <div className="flex min-h-11 items-center justify-between gap-3">
          <p className="text-ink text-base font-bold">전체 {totalCount}개</p>
          <PhotoReviewFilterChip
            pressed={photoOnly}
            disabled={!photoOnly && totalCount === 0}
            onPressedChange={setPhotoOnly}
          />
        </div>
        {error ? (
          <div className="pt-12">
            <p className="text-ink text-base font-semibold">
              후기를 불러오지 못했어요
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="text-ink-sub mt-3 min-h-11 rounded-[6px] bg-gray-100 px-4 text-sm font-semibold"
            >
              다시 시도
            </button>
          </div>
        ) : isPending ? (
          <p className="text-ink-muted pt-12 text-sm">
            후기를 불러오는 중이에요
          </p>
        ) : photoOnly && reviews.length === 0 ? (
          <div className="pt-12">
            <p className="text-ink text-base font-semibold">
              사진 후기가 아직 없어요
            </p>
            <p className="text-ink-muted mt-1 text-sm leading-6">
              필터를 끄면 전체 후기를 볼 수 있어요
            </p>
          </div>
        ) : (
          <div className="mt-7 space-y-8">
            {reviews.map((review) => (
              <RecipeReviewCard key={review.reviewId} review={review} />
            ))}
          </div>
        )}
        <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
      </main>
    </div>
  );
};
