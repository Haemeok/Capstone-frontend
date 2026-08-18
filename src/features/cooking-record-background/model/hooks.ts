"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dispatchForceLogoutEvent } from "@/shared/api/auth";
import { isApiErrorWithCode } from "@/shared/api/errors";

import type {
  CookingRecordListResponse,
  StickerBookBackground,
  StickerBookBackgroundListResponse,
} from "@/entities/recipe";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe";

import { updateStickerBookBackground } from "./api";

export const useUpdateStickerBookBackground = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStickerBookBackground,
    retry: false,
    onSuccess: (background) => {
      queryClient.setQueriesData<InfiniteData<CookingRecordListResponse>>(
        { queryKey: COOKING_RECORD_QUERY_KEYS.lists },
        (data) =>
          data
            ? {
                ...data,
                pages: data.pages.map((page) => ({ ...page, background })),
              }
            : data
      );
      queryClient.setQueryData<StickerBookBackgroundListResponse>(
        COOKING_RECORD_QUERY_KEYS.backgrounds,
        (data) => updateSelectedBackground(data, background)
      );
    },
    onError: async (error) => {
      if (isApiErrorWithCode(error, 400, 901)) {
        await queryClient.refetchQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
        });
      }
      if (isApiErrorWithCode(error, 404, 101)) {
        dispatchForceLogoutEvent("USER_NOT_FOUND");
      }
    },
  });
};

const updateSelectedBackground = (
  data: StickerBookBackgroundListResponse | undefined,
  background: StickerBookBackground
): StickerBookBackgroundListResponse | undefined =>
  data
    ? {
        items: data.items.map((item) => ({
          ...item,
          selected: item.backgroundKey === background.backgroundKey,
        })),
      }
    : data;
