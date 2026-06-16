"use client";

import dynamic from "next/dynamic";

import { Loader2 } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { format, useT } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { formatNumber } from "@/shared/lib/format";
import { shouldShowReviewGate } from "@/shared/lib/review";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { useRecipeStatus } from "@/features/recipe-status";
import { scheduleReviewGate } from "@/features/review-gate";

import { cn } from "@/lib/utils";

import { useRecipeComplete } from "../model/hooks";

const LevelUpModal = dynamic(
  () => import("@/features/level-up").then((mod) => mod.LevelUpModal),
  { ssr: false }
);

type RecipeCompleteButtonProps = {
  saveAmount: number;
  className?: string;
  locale?: Locale;
};

const RecipeCompleteButton = ({
  saveAmount,
  className,
  locale = "ko",
}: RecipeCompleteButtonProps) => {
  const t = useT();
  const { recipeId } = useRecipeStatus();
  const { completeRecipe, isCompleted, isLoading, showReward, setShowReward } =
    useRecipeComplete({ recipeId, saveAmount });
  const { checkAndTrigger } = useNotificationPermissionTrigger();

  const isInternational = locale !== "ko";

  const handleClick = () => {
    if (isCompleted || isLoading) return;
    if (!checkAndTrigger("complete")) return;
    triggerHaptic("Success");
    completeRecipe();
  };

  const handleRewardClose = (open: boolean) => {
    setShowReward(open);
    if (!open && shouldShowReviewGate()) {
      scheduleReviewGate();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isCompleted || isLoading}
        className={cn(
          "group relative w-full rounded-lg py-3 font-semibold transition-all",
          isCompleted
            ? "text-ink-muted cursor-not-allowed bg-gray-200"
            : "bg-olive-mint cursor-pointer text-white active:scale-95",
          isLoading && "opacity-70",
          className
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t.recipeDetail.completeRecording}
          </span>
        ) : isCompleted ? (
          t.recipeDetail.completeAlready
        ) : isInternational ? (
          t.recipeDetail.completeCtaPlain
        ) : (
          format(t.recipeDetail.completeCta, {
            amount: formatNumber(saveAmount, ""),
          })
        )}
      </button>

      {!isInternational && (
        <LevelUpModal
          isOpen={showReward}
          onOpenChange={handleRewardClose}
          acquiredAmount={saveAmount}
        />
      )}
    </>
  );
};

export default RecipeCompleteButton;
