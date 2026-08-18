import Link from "next/link";

import { Image } from "@/shared/ui/image/Image";

import type { PublicCookingReview } from "@/entities/cooking-review/model/types";

type RecipeCookingReviewPreviewPhotosProps = {
  recipeId: string;
  reviews: PublicCookingReview[];
  totalCount: number;
};

const ReviewPhoto = ({
  recipeId,
  review,
  className,
  remainingCount = 0,
}: {
  recipeId: string;
  review: PublicCookingReview;
  className: string;
  remainingCount?: number;
}) => {
  const imageUrl = review.images[0]?.url;

  if (!imageUrl) {
    return null;
  }

  return (
    <Link
      href={`/recipes/${recipeId}/reviews`}
      className={`relative block overflow-hidden rounded-[6px] ${className}`}
      aria-label={`${review.nickname}님의 요리 후기 사진 보기`}
    >
      <Image
        src={imageUrl}
        alt={`${review.nickname}님의 요리 후기 사진`}
        wrapperClassName="h-full w-full"
        imgClassName="rounded-[6px]"
      />
      {remainingCount > 0 ? (
        <span className="absolute inset-0 grid place-items-center bg-black/45 text-base font-semibold text-white">
          +{remainingCount}
        </span>
      ) : null}
    </Link>
  );
};

export const RecipeCookingReviewPreviewPhotos = ({
  recipeId,
  reviews,
  totalCount,
}: RecipeCookingReviewPreviewPhotosProps) => {
  const photoReviews = reviews
    .filter((review) => Boolean(review.images[0]?.url))
    .slice(0, 3);
  const remainingCount = Math.max(totalCount - photoReviews.length, 0);

  if (photoReviews.length === 0) {
    return <div data-photo-layout="none" />;
  }

  if (photoReviews.length === 1) {
    return (
      <div data-photo-layout="one" className="shrink-0">
        <ReviewPhoto
          recipeId={recipeId}
          review={photoReviews[0]}
          className="size-28"
          remainingCount={remainingCount}
        />
      </div>
    );
  }

  const layout = photoReviews.length === 2 ? "two" : "three";

  return (
    <div data-photo-layout={layout} className="grid grid-cols-3 gap-2">
      {photoReviews.map((review, index) => (
        <ReviewPhoto
          key={review.reviewId}
          recipeId={recipeId}
          review={review}
          className="aspect-square w-full"
          remainingCount={
            index === photoReviews.length - 1 ? remainingCount : 0
          }
        />
      ))}
    </div>
  );
};
