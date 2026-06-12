"use client";

import { useEffect } from "react";

import { COOKING_COMPLETION_MESSAGE_DURATION_MS } from "@/shared/config/constants/recipe";
import { formatNumber } from "@/shared/lib/format";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type RecipeCompleteRewardMessageProps = {
  saveAmount: number;
  isOpen: boolean;
  onClose: () => void;
};

const RecipeCompleteRewardMessage = ({
  saveAmount,
  isOpen,
  onClose,
}: RecipeCompleteRewardMessageProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, COOKING_COMPLETION_MESSAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/10" />
      <DialogContent className="animate-in zoom-in-95 border-olive-mint max-w-md border-2 p-4 duration-300 [&>button]:hidden">
        <div className="flex flex-col items-center justify-center">
          <DialogTitle className="text-olive-mint animate-in fade-in slide-in-from-bottom-4 mb-3 text-center text-4xl font-bold duration-500">
            +{formatNumber(saveAmount, "원")} 절약!
          </DialogTitle>
          <p className="animate-in fade-in slide-in-from-bottom-2 text-ink-sub text-center text-sm leading-relaxed duration-700">
            마이페이지 →{" "}
            <span className="text-olive-mint font-bold">캘린더</span>
            에서
            <br />
            이번 달 절약 금액을 확인해보세요!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCompleteRewardMessage;
