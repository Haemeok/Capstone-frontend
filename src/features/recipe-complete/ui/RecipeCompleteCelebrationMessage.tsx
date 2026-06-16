"use client";

import { useEffect } from "react";

import { COOKING_COMPLETION_MESSAGE_DURATION_MS } from "@/shared/config/constants/recipe";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type RecipeCompleteCelebrationMessageProps = {
  title: string;
  body: string;
  isOpen: boolean;
  onClose: () => void;
};

const RecipeCompleteCelebrationMessage = ({
  title,
  body,
  isOpen,
  onClose,
}: RecipeCompleteCelebrationMessageProps) => {
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
          <DialogTitle className="text-olive-mint animate-in fade-in slide-in-from-bottom-4 mb-2 text-center text-3xl font-bold duration-500">
            {title}
          </DialogTitle>
          <p className="animate-in fade-in slide-in-from-bottom-2 text-ink-sub text-center text-sm leading-relaxed duration-700">
            {body}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCompleteCelebrationMessage;
