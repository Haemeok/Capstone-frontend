"use client";

import { useCallback } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import {
  isAppWebView,
  requestAppReview,
  triggerHaptic,
} from "@/shared/lib/bridge";
import { storage } from "@/shared/lib/storage";

import { DECLINE_DURATION_MS, FEEDBACK_URL } from "./constants";
import { useReviewGateStore } from "./store";

export const useReviewGateTrigger = () => {
  const { openDrawer } = useReviewGateStore();

  const trigger = useCallback(() => {
    // WebView 아님 → 패스
    if (!isAppWebView()) {
      return;
    }

    // 이미 리뷰 완료 → 패스
    if (storage.getBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED)) {
      return;
    }

    // 부정 응답 후 30일 미경과 → 패스
    const isDeclined = storage.getItemWithExpiry<boolean>(
      STORAGE_KEYS.REVIEW_GATE_DECLINED
    );
    if (isDeclined) {
      return;
    }

    // 다이얼로그 표시
    openDrawer();
  }, [openDrawer]);

  return { trigger };
};

export const useReviewGateActions = () => {
  const { closeDrawer } = useReviewGateStore();

  // 긍정 응답: 네이티브 리뷰 요청
  const handlePositive = useCallback(() => {
    triggerHaptic("Success");
    requestAppReview();
    storage.setBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED, true);
    closeDrawer();
  }, [closeDrawer]);

  // 부정 응답: 피드백 페이지로 이동
  const handleNegative = useCallback(() => {
    triggerHaptic("Light");
    // 30일 후 재요청 허용
    storage.setItemWithExpiry(
      STORAGE_KEYS.REVIEW_GATE_DECLINED,
      true,
      DECLINE_DURATION_MS
    );
    closeDrawer();
    // 외부 링크 열기
    window.open(FEEDBACK_URL, "_blank");
  }, [closeDrawer]);

  return { handlePositive, handleNegative };
};
