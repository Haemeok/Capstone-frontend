import type {
  PublicCookingReview,
  PublicCookingReviewsResponse,
} from "@/entities/cooking-review/model/types";

import { RecipeCookingReviewPreviewPhotos } from "./RecipeCookingReviewPreviewPhotos";

type RecipeCookingReviewPreviewContentProps = {
  recipeId: string;
  firstReview?: PublicCookingReview;
  photoResponse?: PublicCookingReviewsResponse;
};

const ReviewText = ({ review }: { review: PublicCookingReview }) => (
  <div className="min-w-0 space-y-1">
    <p className="text-ink text-sm font-semibold">{review.nickname}</p>
    <p className="text-ink-sub line-clamp-2 text-sm leading-6">
      {review.content}
    </p>
  </div>
);

export const RecipeCookingReviewPreviewContent = ({
  recipeId,
  firstReview,
  photoResponse,
}: RecipeCookingReviewPreviewContentProps) => {
  const photos = photoResponse?.items ?? [];
  const photoCount = photoResponse?.totalCount ?? 0;

  if (photos.length === 1 && firstReview) {
    return (
      <div className="mt-4 flex items-center gap-4">
        <RecipeCookingReviewPreviewPhotos
          recipeId={recipeId}
          reviews={photos}
          totalCount={photoCount}
        />
        <ReviewText review={firstReview} />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <RecipeCookingReviewPreviewPhotos
        recipeId={recipeId}
        reviews={photos}
        totalCount={photoCount}
      />
      {firstReview ? <ReviewText review={firstReview} /> : null}
    </div>
  );
};
