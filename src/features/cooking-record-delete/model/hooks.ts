"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";

import type { CookingRecordListResponse } from "@/entities/recipe/model/record";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import { deleteCookingRecord } from "./api";

export const useDeleteCookingRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCookingRecord,
    retry: false,
    onSuccess: async (_response, recordId) => {
      queryClient.removeQueries({
        queryKey: ["cooking-record", "detail", recordId],
      });
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
        queryClient.invalidateQueries({ queryKey: ["recordsTimeline"] }),
        queryClient.invalidateQueries({
          queryKey: ["cooking-review", "my"],
        }),
      ]);
    },
  });
};
