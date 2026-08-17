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
  const mutation = useMutation({
    mutationFn: patchCookingRecordImage,
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: async (_response, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cooking-record", "detail", input.recordId],
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.lists,
          refetchType: "none",
        }),
      ]);
    },
  });
  const replaceImage = async (draft: CookingRecordImageDraft) => {
    const request = await prepareCookingRecordImage(draft);
    return mutation.mutateAsync(request);
  };
  return { ...mutation, replaceImage };
};
