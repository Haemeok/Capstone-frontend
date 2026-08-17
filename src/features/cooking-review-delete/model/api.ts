import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CookingReviewMessageResponse } from "@/entities/cooking-review";

export const deleteCookingReview = (
  reviewId: string
): Promise<CookingReviewMessageResponse> =>
  api.delete(END_POINTS.REVIEW(reviewId));
