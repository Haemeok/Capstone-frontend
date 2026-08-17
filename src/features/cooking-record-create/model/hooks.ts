"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";

import type { CookingRecordListResponse } from "@/entities/recipe/model/record";
import {
  RECORD_IMAGE_RETRY_DELAY_MS,
  shouldRetryRecordImageNotReady,
} from "@/entities/recipe/model/recordMutationPolicy";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import {
  type ManualCookingRecordDraft,
  postManualCookingRecord,
  prepareManualCookingRecord,
} from "./api";

export const useCreateManualCookingRecord = () => {
  const queryClient = useQueryClient();
  const prepareMutation = useMutation({
    mutationFn: prepareManualCookingRecord,
    retry: false,
  });
  const finalMutation = useMutation({
    mutationFn: postManualCookingRecord,
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: async () => {
      queryClient.setQueriesData<InfiniteData<CookingRecordListResponse>>(
        { queryKey: COOKING_RECORD_QUERY_KEYS.lists },
        keepFirstInfinitePage
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.lists,
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.calendars,
        }),
      ]);
    },
  });

  const createRecord = async (draft: ManualCookingRecordDraft) => {
    prepareMutation.reset();
    finalMutation.reset();
    const request = await prepareMutation.mutateAsync(draft);
    return finalMutation.mutateAsync(request);
  };

  const reset = () => {
    prepareMutation.reset();
    finalMutation.reset();
  };

  const isPending = prepareMutation.isPending || finalMutation.isPending;
  const hasError = prepareMutation.isError || finalMutation.isError;
  const isError = !isPending && hasError;
  const isSuccess = !isPending && !isError && finalMutation.isSuccess;
  const status = isPending
    ? "pending"
    : isError
      ? "error"
      : isSuccess
        ? "success"
        : "idle";

  return {
    ...finalMutation,
    createRecord,
    reset,
    status,
    isIdle: status === "idle",
    isPending,
    isError,
    isSuccess,
    error: isError ? (prepareMutation.error ?? finalMutation.error) : null,
  };
};
