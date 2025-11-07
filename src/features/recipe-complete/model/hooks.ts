"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToastStore } from "@/widgets/Toast";

import { createRecipeRecord } from "./api";
import { useRecipeCompleteStore } from "./store";

type UseRecipeCompleteOptions = {
  recipeId: number;
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
  const hasCompletedRecipe = useRecipeCompleteStore((state) =>
    state.hasCompletedRecipe(recipeId)
  );

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

  return {
    completeRecipe: mutate,
    isCompleted: hasCompletedRecipe,
    isLoading: isPending,
    error,
    showReward,
    setShowReward,
  };
};
