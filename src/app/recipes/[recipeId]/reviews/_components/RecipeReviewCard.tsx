import { Image } from "@/shared/ui/image/Image";

import {
  CookingReviewAuthorAvatar,
  type PublicCookingReview,
} from "@/entities/cooking-review";

type RecipeReviewCardProps = {
  review: PublicCookingReview;
};

const reviewDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
});

export const RecipeReviewCard = ({ review }: RecipeReviewCardProps) => {
  const firstImage = review.images[0];

  return (
    <article className="space-y-3">
      <div className="flex items-center gap-3">
        <CookingReviewAuthorAvatar
          nickname={review.nickname}
          profileImageUrl={review.profileImageUrl}
          className="size-[38px]"
        />
        <div>
          <p className="text-ink text-sm font-semibold">{review.nickname}</p>
          <time className="text-ink-muted text-xs" dateTime={review.createdAt}>
            {reviewDateFormatter.format(new Date(review.createdAt))}
          </time>
        </div>
      </div>
      <p className="text-ink-sub text-sm leading-6 whitespace-pre-wrap">
        {review.content}
      </p>
      {firstImage ? (
        <Image
          src={firstImage.url}
          alt={`${review.nickname}님의 요리 후기 사진`}
          aspectRatio="1 / 1"
          wrapperClassName="w-full rounded-[6px]"
          imgClassName="rounded-[6px]"
        />
      ) : null}
    </article>
  );
};
