import type {
  PublicCookingReview,
  PublicCookingReviewsResponse,
} from "@/entities/cooking-review";

export const makePublicReview = (index: number): PublicCookingReview => ({
  reviewId: `review-${String(index).padStart(2, "0")}`,
  nickname: `요리왕 ${String(index).padStart(2, "0")}`,
  profileImageUrl: null,
  content: `후기 ${String(index).padStart(2, "0")}`,
  images: [],
  createdAt: `2026-08-${String(Math.min(index, 28)).padStart(2, "0")}T10:00:00+09:00`,
  mine: false,
});

export const makeReviewPage = (
  count: number,
  totalCount: number,
  hasNext: boolean,
  start = 1
): PublicCookingReviewsResponse => ({
  totalCount,
  items: Array.from({ length: count }, (_, index) =>
    makePublicReview(start + index)
  ),
  hasNext,
});

export const makePhotoReviewPage = (
  count: number
): PublicCookingReviewsResponse => ({
  totalCount: count,
  items: Array.from({ length: count }, (_, index) => ({
    ...makePublicReview(index + 1),
    images: [{ url: `https://example.com/photo-${index + 1}.jpg` }],
  })),
  hasNext: false,
});
