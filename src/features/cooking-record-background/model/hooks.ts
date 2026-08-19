"use client";

import { useRef } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dispatchForceLogoutEvent } from "@/shared/api/auth";
import { isApiErrorWithCode } from "@/shared/api/errors";

import type {
  CookingRecordListResponse,
  CustomStickerBookBackgroundCreateResponse,
  StickerBookBackground,
  StickerBookBackgroundListResponse,
} from "@/entities/recipe";
import type { CustomStickerBookBackgroundCreateInput } from "@/entities/recipe";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe";
import {
  RECORD_IMAGE_RETRY_DELAY_MS,
  shouldRetryRecordImageNotReady,
} from "@/entities/recipe/model/recordMutationPolicy";

import {
  deleteCustomStickerBookBackground,
  prepareCustomStickerBookBackground,
  registerCustomStickerBookBackground,
  updateStickerBookBackground,
} from "./api";

export const useCreateCustomStickerBookBackground = () => {
  const queryClient = useQueryClient();
  const registrationInputRef = useRef<
    CustomStickerBookBackgroundCreateInput | undefined
  >(undefined);
  const prepareMutation = useMutation({
    mutationFn: prepareCustomStickerBookBackground,
    retry: false,
  });
  const registerMutation = useMutation({
    mutationFn: registerCustomStickerBookBackground,
    retry: shouldRetryRecordImageNotReady,
    retryDelay: RECORD_IMAGE_RETRY_DELAY_MS,
    onSuccess: (background) => {
      queryClient.setQueryData<StickerBookBackgroundListResponse>(
        COOKING_RECORD_QUERY_KEYS.backgrounds,
        (data) => addCustomBackground(data, background)
      );
    },
  });

  const reset = () => {
    prepareMutation.reset();
    registerMutation.reset();
    registrationInputRef.current = undefined;
  };

  const createCustomBackground = async (file: File) => {
    reset();
    const input = await prepareMutation.mutateAsync(file);
    registrationInputRef.current = input;
    return registerMutation.mutateAsync(input);
  };

  const retryRegistration = async () => {
    const input = registrationInputRef.current;
    if (input === undefined) return undefined;
    registerMutation.reset();
    return registerMutation.mutateAsync(input);
  };

  const isPending = prepareMutation.isPending || registerMutation.isPending;
  const isImageProcessing =
    registerMutation.isPending &&
    isApiErrorWithCode(registerMutation.failureReason, 409, 807);
  const hasError = prepareMutation.isError || registerMutation.isError;
  const isError = !isPending && hasError;
  const isSuccess = !isPending && !isError && registerMutation.isSuccess;
  const status = isPending
    ? "pending"
    : isError
      ? "error"
      : isSuccess
        ? "success"
        : "idle";

  return {
    createCustomBackground,
    retryRegistration,
    reset,
    status,
    isPending,
    isImageProcessing,
    isError,
    isSuccess,
    error: isError ? (prepareMutation.error ?? registerMutation.error) : null,
  };
};

export const useUpdateStickerBookBackground = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStickerBookBackground,
    retry: false,
    onSuccess: async (background, input) => {
      const backgroundList =
        queryClient.getQueryData<StickerBookBackgroundListResponse>(
          COOKING_RECORD_QUERY_KEYS.backgrounds
        );
      const selectedOption = backgroundList?.items.find(
        (item) => item.backgroundKey === input.backgroundKey
      );
      if (selectedOption === undefined) {
        await queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.lists,
        });
      } else {
        const appliedBackground: StickerBookBackground = {
          backgroundKey: background.backgroundKey,
          backgroundType: selectedOption.backgroundType,
          imageUrl: background.imageUrl,
        };
        queryClient.setQueriesData<InfiniteData<CookingRecordListResponse>>(
          { queryKey: COOKING_RECORD_QUERY_KEYS.lists },
          (data) =>
            data
              ? {
                  ...data,
                  pages: data.pages.map((page) => ({
                    ...page,
                    background: appliedBackground,
                  })),
                }
              : data
        );
      }
      queryClient.setQueryData<StickerBookBackgroundListResponse>(
        COOKING_RECORD_QUERY_KEYS.backgrounds,
        (data) => updateSelectedBackground(data, background.backgroundKey)
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

type DeleteCustomBackgroundInput = {
  backgroundKey: string;
  wasApplied: boolean;
};

export const useDeleteCustomStickerBookBackground = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ backgroundKey }: DeleteCustomBackgroundInput) =>
      deleteCustomStickerBookBackground(backgroundKey),
    retry: false,
    onSuccess: async (_, input) => {
      queryClient.setQueryData<StickerBookBackgroundListResponse>(
        COOKING_RECORD_QUERY_KEYS.backgrounds,
        (data) => removeCustomBackground(data, input.backgroundKey)
      );
      if (!input.wasApplied) return;
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
        }),
        queryClient.invalidateQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.lists,
        }),
      ]);
    },
    onError: async (error) => {
      if (isApiErrorWithCode(error, 404, 808)) {
        await queryClient.refetchQueries({
          queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
        });
      }
    },
  });
};

const updateSelectedBackground = (
  data: StickerBookBackgroundListResponse | undefined,
  backgroundKey: string
): StickerBookBackgroundListResponse | undefined =>
  data
    ? {
        items: data.items.map((item) => ({
          ...item,
          selected: item.backgroundKey === backgroundKey,
        })),
      }
    : data;

const addCustomBackground = (
  data: StickerBookBackgroundListResponse | undefined,
  background: CustomStickerBookBackgroundCreateResponse
): StickerBookBackgroundListResponse => ({
  items: [
    { ...background, selected: false },
    ...(data?.items.filter(
      (item) => item.backgroundKey !== background.backgroundKey
    ) ?? []),
  ],
});

const removeCustomBackground = (
  data: StickerBookBackgroundListResponse | undefined,
  backgroundKey: string
): StickerBookBackgroundListResponse | undefined =>
  data
    ? {
        items: data.items.filter(
          (item) => item.backgroundKey !== backgroundKey
        ),
      }
    : data;
