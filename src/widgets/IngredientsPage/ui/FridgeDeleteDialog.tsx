"use client";

import type { RefObject } from "react";

import { format } from "@/shared/i18n/format";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type FridgeDeleteDialogProps = {
  isOpen: boolean;
  isPending: boolean;
  selectedNames: string[];
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
};

export const FridgeDeleteDialog = ({
  isOpen,
  isPending,
  selectedNames,
  returnFocusRef,
  onOpenChange,
  onConfirm,
}: FridgeDeleteDialogProps) => {
  const t = useIngredientsDict().deleteDialog;
  const visibleNames = selectedNames.slice(0, 2).join(", ");
  const summary =
    selectedNames.length > 2
      ? format(t.more, {
          names: visibleNames,
          count: selectedNames.length - 2,
        })
      : visibleNames;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isPending) onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    if (!isPending) onConfirm();
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    returnFocusRef.current?.focus();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={handleCloseAutoFocus}
        className="max-w-sm border-gray-200 bg-white"
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-ink">{t.title}</DialogTitle>
          <DialogDescription className="text-ink-sub leading-6">
            {format(t.description, { summary })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
            className="text-ink-sub focus-visible:ring-olive-light min-h-11 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-default disabled:opacity-50"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="bg-ink focus-visible:ring-ink min-h-11 cursor-pointer rounded-xl px-4 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-default disabled:opacity-50"
          >
            {isPending ? t.pending : t.confirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
