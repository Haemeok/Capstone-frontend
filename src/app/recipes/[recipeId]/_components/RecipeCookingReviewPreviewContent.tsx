import {
  CookingReviewAuthorAvatar,
  type PublicCookingReview,
  type PublicCookingReviewsResponse,
} from "@/entities/cooking-review";

import { RecipeCookingReviewPreviewPhotos } from "./RecipeCookingReviewPreviewPhotos";

type RecipeCookingReviewPreviewContentProps = {
  recipeId: string;
  firstReview?: PublicCookingReview;
  photoResponse?: PublicCookingReviewsResponse;
  emptyTitle: string;
  emptyDescription: string;
};

const ReviewText = ({
  review,
  showAvatar,
}: {
  review: PublicCookingReview;
  showAvatar: boolean;
}) => (
  <div className="flex min-w-0 items-start gap-2.5">
    {showAvatar ? (
      <CookingReviewAuthorAvatar
        nickname={review.nickname}
        profileImageUrl={review.profileImageUrl}
      />
    ) : null}
    <div className="min-w-0 space-y-1">
      <p className="text-ink text-sm font-semibold">{review.nickname}</p>
      <p className="text-ink-sub line-clamp-2 text-sm leading-6">
        {review.content}
      </p>
    </div>
  </div>
);

export const RecipeCookingReviewPreviewContent = ({
  recipeId,
  firstReview,
  photoResponse,
  emptyTitle,
  emptyDescription,
}: RecipeCookingReviewPreviewContentProps) => {
  const photos = photoResponse?.items ?? [];
  const photoCount = photoResponse?.totalCount ?? 0;

  if (!firstReview && photos.length === 0) {
    return (
      <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-5">
        <p className="text-ink text-sm font-semibold">{emptyTitle}</p>
        <p className="text-ink-muted mt-1 text-sm">{emptyDescription}</p>
      </div>
    );
  }

  if (photos.length === 0 && firstReview) {
    return (
      <div className="mt-4">
        <ReviewText review={firstReview} showAvatar />
      </div>
    );
  }

  if (photos.length === 1 && firstReview) {
    return (
      <div className="mt-4 flex items-center gap-4">
        <RecipeCookingReviewPreviewPhotos
          recipeId={recipeId}
          reviews={photos}
          totalCount={photoCount}
        />
        <ReviewText review={firstReview} showAvatar={false} />
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
      {firstReview ? <ReviewText review={firstReview} showAvatar /> : null}
    </div>
  );
};
