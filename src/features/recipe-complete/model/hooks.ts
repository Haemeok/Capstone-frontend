"use client";

import { useEffect, useState } from "react";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";
import { trackReviewAction } from "@/shared/lib/review";

import {
  COOKING_REVIEW_QUERY_KEYS,
  keepFirstCookingReviewPages,
} from "@/entities/cooking-review";
import type {
  CookingRecordListResponse,
  RecipeCookingRecordCreateInput,
} from "@/entities/recipe/model/record";
import { keepFirstRecordsTimelinePages } from "@/entities/recipe/model/recordCache";
import {
  RECORD_IMAGE_RETRY_DELAY_MS,
  shouldRetryRecordImageNotReady,
} from "@/entities/recipe/model/recordMutationPolicy";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import {
  createRecipeRecord,
  prepareRecipeCookingRecord,
  type RecipeCookingRecordDraft,
} from "./api";
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
  keepFirstRecordsTimelinePages(queryClient);
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
    keepFirstCookingReviewPages(queryClient);
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: COOKING_REVIEW_QUERY_KEYS.all,
      })
    );
  }
  await Promise.all(invalidations);
};

export const useCreateRecipeCookingRecordMutation = () => {
  const queryClient = useQueryClient();
  const prepareMutation = useMutation({
    mutationFn: prepareRecipeCookingRecord,
    retry: false,
  });
  const finalMutation = useMutation({
    mutationFn: (input: string | RecipeCookingRecordCreateInput) =>
      createRecipeRecord(input),
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: (_response, input) => {
      const recipeId = typeof input === "string" ? input : input.recipeId;
      const publishReview =
        typeof input === "string" ? false : input.publishReview === true;
      return invalidateRecipeRecordCaches(queryClient, recipeId, publishReview);
    },
  });

  const createRecord = async (draft: RecipeCookingRecordDraft) => {
    prepareMutation.reset();
    finalMutation.reset();
    const request = await prepareMutation.mutateAsync(draft);
    return finalMutation.mutateAsync(request);
  };

  const completeWithoutDetails = async (recipeId: string) => {
    prepareMutation.reset();
    finalMutation.reset();
    return finalMutation.mutateAsync(recipeId);
  };

  return {
    ...finalMutation,
    createRecord,
    completeWithoutDetails,
    isPending: prepareMutation.isPending || finalMutation.isPending,
    error: prepareMutation.error ?? finalMutation.error,
  };
};

export const useRecipeComplete = ({
  recipeId,
  saveAmount,
  onRewardShow,
}: UseRecipeCompleteOptions) => {
  const [showReward, setShowReward] = useState(false);
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

  const openCompletionFlow = () => {
    setShowReward(true);
    onRewardShow?.(saveAmount);
  };

  const markCompleted = () => {
    addCompletedRecipe(recipeId);
    trackReviewAction("cooking_complete");
  };

  return {
    completeRecipe: openCompletionFlow,
    // hydration 전에는 false 반환 (플래시 방지)
    isCompleted: isHydrated ? hasCompletedRecipe : false,
    showReward,
    setShowReward,
    markCompleted,
  };
};
