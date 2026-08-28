"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

export type CookingRecordDeleteDialogProps = {
  isOpen: boolean;
  isPending: boolean;
  copy: {
    title: string;
    description: string;
    cancel: string;
    confirm: string;
  };
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const CookingRecordDeleteDialog = (
  props: CookingRecordDeleteDialogProps
) => {
  const { isOpen, isPending, copy, onOpenChange, onCancel, onConfirm } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[318px] gap-0 rounded-[18px] border-0 bg-white p-5 shadow-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-ink text-lg leading-6 font-bold">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-ink-sub mt-2 text-sm leading-5.5">
            {copy.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="text-ink-sub focus-visible:outline-olive-dark min-h-11 cursor-pointer rounded-xl bg-gray-100 text-sm font-bold transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="min-h-11 cursor-pointer rounded-xl bg-red-500 text-sm font-bold text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            {copy.confirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
