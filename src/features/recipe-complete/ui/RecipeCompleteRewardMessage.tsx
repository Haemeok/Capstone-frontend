"use client";

import { useEffect } from "react";

import { formatNumber } from "@/shared/lib/format";
import { COOKING_COMPLETION_MESSAGE_DURATION_MS } from "@/shared/config/constants/recipe";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
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
      <DialogContent className="max-w-md animate-in zoom-in-95 duration-300 border-2 border-olive-mint p-4 [&>button]:hidden">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-3 text-center text-4xl font-bold text-olive-mint animate-in fade-in slide-in-from-bottom-4 duration-500">
            +{formatNumber(saveAmount, "원")} 절약!
          </h1>
          <p className="text-center text-sm leading-relaxed text-gray-600 animate-in fade-in slide-in-from-bottom-2 duration-700">
            마이페이지 →{" "}
            <span className="font-bold text-olive-mint">캘린더</span>
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
