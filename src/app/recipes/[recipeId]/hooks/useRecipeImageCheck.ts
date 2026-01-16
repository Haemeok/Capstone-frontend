"use client";

import { useEffect, useState, useRef } from "react";

import api from "@/shared/api/client";

import { invalidateRecipeCache } from "../actions";

const IMAGE_CHECK_DELAY_MS = 2000;
const MAX_RETRY_COUNT = 2;

type UseRecipeImageCheckParams = {
  recipeId: string;
  initialImageUrl: string | null;
};

type UseRecipeImageCheckResult = {
  imageUrl: string | null;
  retryCount: number;
  isChecking: boolean;
};

export const useRecipeImageCheck = ({
  recipeId,
  initialImageUrl,
}: UseRecipeImageCheckParams): UseRecipeImageCheckResult => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [retryCount, setRetryCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // 이미 이미지가 있거나 최대 재시도 횟수 초과시 중단
    if (initialImageUrl || retryCount >= MAX_RETRY_COUNT) return;

    const checkForImage = async () => {
      setIsChecking(true);

      await new Promise((r) => setTimeout(r, IMAGE_CHECK_DELAY_MS));

      // 컴포넌트 언마운트 체크
      if (!isMountedRef.current) return;

      try {
        const recipe = await api.get<{ imageUrl: string | null }>(
          `/v2/recipes/${recipeId}`
        );

        if (!isMountedRef.current) return;

        if (recipe.imageUrl) {
          // 1. 현재 사용자: state로 이미지 즉시 표시
          setImageUrl(recipe.imageUrl);

          // 2. 다음 사용자: 서버 캐시 무효화
          await invalidateRecipeCache(recipeId);
        } else {
          // 이미지가 없으면 재시도 카운트 증가
          setRetryCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("[useRecipeImageCheck] Failed to check image:", error);
        // 에러 발생 시에도 재시도 카운트 증가
        if (isMountedRef.current) {
          setRetryCount((prev) => prev + 1);
        }
      } finally {
        if (isMountedRef.current) {
          setIsChecking(false);
        }
      }
    };

    checkForImage();
  }, [recipeId, initialImageUrl, retryCount]);

  return { imageUrl, retryCount, isChecking };
};

// 테스트를 위한 상수 export
export const IMAGE_CHECK_CONFIG = {
  DELAY_MS: IMAGE_CHECK_DELAY_MS,
  MAX_RETRY: MAX_RETRY_COUNT,
} as const;
