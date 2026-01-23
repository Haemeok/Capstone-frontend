"use client";

import dynamic from "next/dynamic";

import { Loader2 } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { formatNumber } from "@/shared/lib/format";

import { useNotificationPermissionTrigger } from "@/features/notification-permission";
import { useRecipeStatus } from "@/features/recipe-status";

import { cn } from "@/lib/utils";

import { useRecipeComplete } from "../model/hooks";

const LevelUpModal = dynamic(
  () => import("@/features/level-up").then((mod) => mod.LevelUpModal),
  { ssr: false }
);

type RecipeCompleteButtonProps = {
  saveAmount: number;
  className?: string;
};

const RecipeCompleteButton = ({
  saveAmount,
  className,
}: RecipeCompleteButtonProps) => {
  const { recipeId } = useRecipeStatus();
  const { completeRecipe, isCompleted, isLoading, showReward, setShowReward } =
    useRecipeComplete({ recipeId, saveAmount });
  const { checkAndTrigger } = useNotificationPermissionTrigger();

  const handleClick = () => {
    if (isCompleted || isLoading) return;
    if (!checkAndTrigger("complete")) return;
    triggerHaptic("Success");
    completeRecipe();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isCompleted || isLoading}
        className={cn(
          "group relative w-full rounded-lg py-3 font-semibold transition-all",
          isCompleted
            ? "cursor-not-allowed bg-gray-200 text-gray-500"
            : "bg-olive-mint cursor-pointer text-white active:scale-95",
          isLoading && "opacity-70",
          className
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            기록 중...
          </span>
        ) : isCompleted ? (
          "이미 요리를 완료한 레시피예요"
        ) : (
          `✅ 요리 완료! (${formatNumber(saveAmount, "원")} 절약)`
        )}
      </button>

      <LevelUpModal
        isOpen={showReward}
        onOpenChange={setShowReward}
        acquiredAmount={saveAmount}
      />
    </>
  );
};

export default RecipeCompleteButton;
