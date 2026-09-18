"use client";

import type { ComponentType } from "react";

import { useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { RecordPhotoEditorProps } from "@/entities/recipe/model/recordPhoto.types";

import {
  useCreateRecipeCookingRecordMutation,
  useRecipeComplete,
} from "../model/hooks";
import { toRecipeCookingRecordInput } from "../model/recordDraft";
import type { RecipeCookingRecordFormDraft } from "./recipeCookingRecord.types";
import { RecipeCookingRecordFlow } from "./RecipeCookingRecordFlow";

type FirstCookingReviewButtonProps = {
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  saveAmount: number;
  onBeforeStart: () => boolean;
  onFlowClose?: () => void;
  photoEditor?: ComponentType<RecordPhotoEditorProps>;
};

export const FirstCookingReviewButton = ({
  recipeId,
  recipeTitle,
  recipeImageUrl,
  saveAmount,
  onBeforeStart,
  onFlowClose,
  photoEditor,
}: FirstCookingReviewButtonProps) => {
  const t = useT();
  const { completeRecipe, showReward, setShowReward, markCompleted } =
    useRecipeComplete({ recipeId, saveAmount });
  const createMutation = useCreateRecipeCookingRecordMutation();

  const handleStart = () => {
    if (createMutation.isPending || !onBeforeStart()) {
      return;
    }

    triggerHaptic("Medium");
    completeRecipe();
  };

  const handleSubmit = async ({
    imageFile,
    photo,
    ...draft
  }: RecipeCookingRecordFormDraft) => {
    const input = toRecipeCookingRecordInput(draft);
    await createMutation.createRecord({ ...input, imageFile, photo });
    markCompleted();
  };

  const handleSkip = async () => {
    await createMutation.completeWithoutDetails(recipeId);
    markCompleted();
  };

  const handleOpenChange = (open: boolean) => {
    setShowReward(open);
    if (!open) {
      onFlowClose?.();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleStart}
        disabled={createMutation.isPending}
        className="bg-olive-light disabled:text-ink-disabled h-12 w-full rounded-xl px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {t.recipeDetail.cookingRecord.firstReviewCta}
      </button>
      <RecipeCookingRecordFlow
        isOpen={showReward}
        saveAmount={saveAmount}
        recipeId={recipeId}
        recipeTitle={recipeTitle}
        recipeImageUrl={recipeImageUrl}
        copy={t.recipeDetail.cookingRecord}
        photoEditor={photoEditor}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
      />
    </>
  );
};
