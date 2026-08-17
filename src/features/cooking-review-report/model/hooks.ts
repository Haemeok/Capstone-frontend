import { useMutation } from "@tanstack/react-query";

import { reportCookingReview, type ReportCookingReviewRequest } from "./api";

export type ReportCookingReviewVariables = ReportCookingReviewRequest & {
  reviewId: string;
};

export const useReportCookingReview = () =>
  useMutation({
    mutationFn: ({ reviewId, ...request }: ReportCookingReviewVariables) =>
      reportCookingReview(reviewId, request),
  });
