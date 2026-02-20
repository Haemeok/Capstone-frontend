"use client";

import {
  ReviewGateDrawer,
  useReviewGateActions,
  useReviewGateStore,
} from "@/features/review-gate";
import { isAppWebView } from "@/shared/lib/bridge";

const GlobalReviewGateDrawer = () => {
  const { isDrawerOpen, closeDrawer } = useReviewGateStore();
  const { handlePositive, handleNegative } = useReviewGateActions();

  if (!isAppWebView()) return null;

  return (
    <ReviewGateDrawer
      isOpen={isDrawerOpen}
      onOpenChange={(open) => !open && closeDrawer()}
      onPositive={handlePositive}
      onNegative={handleNegative}
    />
  );
};

export default GlobalReviewGateDrawer;
