"use client";

import { useEffect, useState } from "react";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";
import { trackReviewAction } from "@/shared/lib/review";
import { useToastStore } from "@/shared/ui/toast";

import type {
  CookingRecordListResponse,
  RecipeCookingRecordCreateInput,
} from "@/entities/recipe/model/record";
import {
  RECORD_IMAGE_RETRY_DELAY_MS,
  shouldRetryRecordImageNotReady,
} from "@/entities/recipe/model/recordMutationPolicy";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { createRecipeRecord } from "./api";
import { useRecipeCompleteStore } from "./store";

type UseRecipeCompleteOptions = {
  recipeId: string;
  saveAmount: number;
  onRewardShow?: (saveAmount: number) => void;
};

const invalidateRecipeRecordCaches = async (
  queryClient: QueryClient,
  recipeId: string,
  publishReview: boolean
) => {
  queryClient.setQueriesData<InfiniteData<CookingRecordListResponse>>(
    { queryKey: COOKING_RECORD_QUERY_KEYS.lists },
    keepFirstInfinitePage
  );
  const invalidations = [
    COOKING_RECORD_QUERY_KEYS.lists,
    COOKING_RECORD_QUERY_KEYS.calendars,
    ["recipeHistory"],
    ["myInfo"],
    ["recipeHistoryItems"],
    ["userStreak"],
    ["recordsTimeline"],
    ["recipe", recipeId],
  ].map((queryKey) => queryClient.invalidateQueries({ queryKey }));
  if (publishReview) {
    invalidations.push(
      queryClient.invalidateQueries({ queryKey: ["cooking-review"] })
    );
  }
  await Promise.all(invalidations);
};

export const useCreateRecipeCookingRecordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecipeCookingRecordCreateInput) =>
      createRecipeRecord(input),
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: (_response, input) =>
      invalidateRecipeRecordCaches(
        queryClient,
        input.recipeId,
        input.publishReview === true
      ),
  });
};

export const useRecipeComplete = ({
  recipeId,
  saveAmount,
  onRewardShow,
}: UseRecipeCompleteOptions) => {
  const [showReward, setShowReward] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const addCompletedRecipe = useRecipeCompleteStore(
    (state) => state.addCompletedRecipe
  );
  const isHydrated = useRecipeCompleteStore((state) => state.isHydrated);
  const hydrateFromStorage = useRecipeCompleteStore(
    (state) => state.hydrateFromStorage
  );
  const hasCompletedRecipe = useRecipeCompleteStore((state) =>
    state.hasCompletedRecipe(recipeId)
  );

  // 클라이언트 마운트 시 localStorage에서 hydration
  useEffect(() => {
    if (!isHydrated) {
      hydrateFromStorage();
    }
  }, [isHydrated, hydrateFromStorage]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => createRecipeRecord(recipeId),
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: async () => {
      addCompletedRecipe(recipeId);
      setShowReward(true);
      trackReviewAction("cooking_complete");

      if (onRewardShow) {
        onRewardShow(saveAmount);
      }

      await invalidateRecipeRecordCaches(queryClient, recipeId, false);
    },
    onError: (error: Error) => {
      const errorMessage =
        error?.message || "요리 완료 기록에 실패했습니다. 다시 시도해주세요.";
      addToast({
        message: errorMessage,
        variant: "error",
        position: "bottom",
      });
    },
  });

  const authenticatedCompleteRecipe = useAuthenticatedAction<void, undefined>(
    mutate,
    { notifyOnly: true }
  );

  return {
    completeRecipe: authenticatedCompleteRecipe,
    // hydration 전에는 false 반환 (플래시 방지)
    isCompleted: isHydrated ? hasCompletedRecipe : false,
    isLoading: isPending,
    error,
    showReward,
    setShowReward,
  };
};
