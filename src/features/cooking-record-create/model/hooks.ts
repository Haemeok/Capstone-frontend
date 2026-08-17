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
  const mutation = useMutation({
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
    const request = await prepareManualCookingRecord(draft);
    return mutation.mutateAsync(request);
  };

  return { ...mutation, createRecord };
};
