"use client";

import { useState, useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToastStore } from "@/widgets/Toast";
import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { createRecipeRecord } from "./api";
import { useRecipeCompleteStore } from "./store";

type UseRecipeCompleteOptions = {
  recipeId: string;
  saveAmount: number;
  onRewardShow?: (saveAmount: number) => void;
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
    onSuccess: () => {
      addCompletedRecipe(recipeId);
      setShowReward(true);

      if (onRewardShow) {
        onRewardShow(saveAmount);
      }

      queryClient.invalidateQueries({ queryKey: ["recipeHistory"] });
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      queryClient.invalidateQueries({ queryKey: ["recipeHistoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["userStreak"] });
    },
    onError: (error: any) => {
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
