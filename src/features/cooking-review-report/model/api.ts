import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CookingReviewMessageResponse } from "@/entities/cooking-review";

export type CookingReviewReportReason =
  | "INAPPROPRIATE"
  | "SPAM"
  | "COPYRIGHT"
  | "ETC";

export type ReportCookingReviewRequest = {
  reasonType: CookingReviewReportReason;
  detail?: string;
};

export const reportCookingReview = async (
  reviewId: string,
  request: ReportCookingReviewRequest
): Promise<CookingReviewMessageResponse> => {
  if (request.detail !== undefined && request.detail.length > 200) {
    throw new Error("신고 상세는 200자 이하여야 합니다.");
  }
  return api.post(END_POINTS.REVIEW_REPORTS(reviewId), request);
};
