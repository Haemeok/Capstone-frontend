"use client";

import { Loader2 } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { cn } from "@/lib/utils";

import {
  useCreateRecipeCookingRecordMutation,
  useRecipeComplete,
} from "../model/hooks";
import { toRecipeCookingRecordInput } from "../model/recordDraft";
import type { RecipeCookingRecordFormDraft } from "./recipeCookingRecord.types";
import { RecipeCookingRecordFlow } from "./RecipeCookingRecordFlow";

type RecipeCompleteButtonProps = {
  saveAmount: number;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  onBeforeStart?: () => boolean;
  onFlowClose?: () => void;
  className?: string;
  locale?: Locale;
};

const RecipeCompleteButton = ({
  saveAmount,
  recipeId,
  recipeTitle,
  recipeImageUrl,
  onBeforeStart,
  onFlowClose,
  className,
  locale = "ko",
}: RecipeCompleteButtonProps) => {
  const t = useT();
  const {
    completeRecipe,
    isCompleted,
    showReward,
    setShowReward,
    markCompleted,
  } = useRecipeComplete({ recipeId, saveAmount });
  const createMutation = useCreateRecipeCookingRecordMutation();

  const handleClick = () => {
    if (isCompleted || createMutation.isPending) return;
    if (onBeforeStart && !onBeforeStart()) return;
    triggerHaptic("Medium");
    completeRecipe();
  };

  const handleOpenChange = (open: boolean) => {
    setShowReward(open);
    if (!open) onFlowClose?.();
  };

  const handleSubmit = async ({
    imageFile,
    ...draft
  }: RecipeCookingRecordFormDraft) => {
    const input = toRecipeCookingRecordInput(draft);
    await createMutation.createRecord({ ...input, imageFile });
    markCompleted();
  };

  const buttonLabel =
    locale === "ko"
      ? t.recipeDetail.completeCta
      : t.recipeDetail.completeCtaPlain;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isCompleted || createMutation.isPending}
        className={cn(
          "group relative w-full rounded-sm py-4 text-sm font-semibold transition-all",
          isCompleted
            ? "text-ink-muted cursor-not-allowed bg-gray-200"
            : "bg-olive-mint cursor-pointer text-white active:scale-95",
          createMutation.isPending && "opacity-70",
          className
        )}
      >
        {createMutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            {t.recipeDetail.completeRecording}
          </span>
        ) : isCompleted ? (
          t.recipeDetail.completeAlready
        ) : (
          buttonLabel
        )}
      </button>

      <RecipeCookingRecordFlow
        isOpen={showReward}
        saveAmount={saveAmount}
        recipeId={recipeId}
        recipeTitle={recipeTitle}
        recipeImageUrl={recipeImageUrl}
        copy={t.recipeDetail.cookingRecord}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default RecipeCompleteButton;
