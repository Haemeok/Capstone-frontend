"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";

import type {
  CookingRecordListResponse,
  CookingRecordMetadataUpdateInput,
} from "@/entities/recipe/model/record";
import {
  RECORD_IMAGE_RETRY_DELAY_MS,
  shouldRetryRecordImageNotReady,
} from "@/entities/recipe/model/recordMutationPolicy";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import {
  type CookingRecordImageDraft,
  patchCookingRecordImage,
  prepareCookingRecordImage,
  updateCookingRecordMetadata,
} from "./api";

export const useUpdateCookingRecordMetadata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CookingRecordMetadataUpdateInput) =>
      updateCookingRecordMetadata(input),
    retry: false,
    onSuccess: async (_response, input) => {
      queryClient.setQueriesData<InfiniteData<CookingRecordListResponse>>(
        { queryKey: COOKING_RECORD_QUERY_KEYS.lists },
        keepFirstInfinitePage
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cooking-record", "detail", input.recordId],
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.lists,
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.calendars,
        }),
      ]);
    },
  });
};

export const useReplaceCookingRecordImage = () => {
  const queryClient = useQueryClient();
  const prepareMutation = useMutation({
    mutationFn: prepareCookingRecordImage,
    retry: false,
  });
  const finalMutation = useMutation({
    mutationFn: patchCookingRecordImage,
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: async (_response, input) => {
      queryClient.setQueriesData<InfiniteData<CookingRecordListResponse>>(
        { queryKey: COOKING_RECORD_QUERY_KEYS.lists },
        keepFirstInfinitePage
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cooking-record", "detail", input.recordId],
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.lists,
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.calendars,
        }),
      ]);
    },
  });
  const replaceImage = async (draft: CookingRecordImageDraft) => {
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
    replaceImage,
    reset,
    status,
    isIdle: status === "idle",
    isPending,
    isError,
    isSuccess,
    error: isError ? (prepareMutation.error ?? finalMutation.error) : null,
  };
};
