"use client";

import { shouldShowReviewGate } from "@/shared/lib/review";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { FirstCookingReviewButton } from "@/features/recipe-complete";
import { scheduleReviewGate } from "@/features/review-gate";

type FirstCookingReviewCtaProps = {
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  saveAmount: number;
};

export const FirstCookingReviewCta = (props: FirstCookingReviewCtaProps) => {
  const { checkAndTrigger } = useNotificationPermissionTrigger();
  const startIfAuthenticated = useAuthenticatedAction<void, undefined, boolean>(
    () => checkAndTrigger("complete"),
    { notifyOnly: true }
  );

  const handleFlowClose = () => {
    if (shouldShowReviewGate()) {
      scheduleReviewGate();
    }
  };

  return (
    <FirstCookingReviewButton
      {...props}
      onBeforeStart={() => startIfAuthenticated() === true}
      onFlowClose={handleFlowClose}
    />
  );
};
