"use client";

import type { Locale } from "@/shared/i18n";
import { shouldShowReviewGate } from "@/shared/lib/review";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { RecipeCompleteButton } from "@/features/recipe-complete";
import { scheduleReviewGate } from "@/features/review-gate";

type RecipeCompleteSectionProps = {
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  saveAmount: number;
  locale: Locale;
};

export const RecipeCompleteSection = ({
  recipeId,
  recipeTitle,
  recipeImageUrl,
  saveAmount,
  locale,
}: RecipeCompleteSectionProps) => {
  const { checkAndTrigger } = useNotificationPermissionTrigger();
  const startIfAuthenticated = useAuthenticatedAction<void, undefined, boolean>(
    () => checkAndTrigger("complete"),
    { notifyOnly: true }
  );

  const handleFlowClose = () => {
    if (shouldShowReviewGate()) scheduleReviewGate();
  };

  return (
    <RecipeCompleteButton
      recipeId={recipeId}
      recipeTitle={recipeTitle}
      recipeImageUrl={recipeImageUrl}
      saveAmount={saveAmount}
      locale={locale}
      onBeforeStart={() => startIfAuthenticated() === true}
      onFlowClose={handleFlowClose}
    />
  );
};
