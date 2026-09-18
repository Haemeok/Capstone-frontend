"use client";

import { useCommonDict } from "@/shared/i18n";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type DeleteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  cancelLabel?: string;
  confirmLabel?: string;
  isPending?: boolean;
  pendingLabel?: string;
  closeButtonClassName?: string;
};

export const DeleteModal = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  cancelLabel,
  confirmLabel,
  isPending = false,
  pendingLabel,
  closeButtonClassName,
}: DeleteModalProps) => {
  const t = useCommonDict();
  const resolvedDescription = description ?? t.modal.delete.description;
  const resolvedCancel = cancelLabel ?? t.modal.delete.cancel;
  const resolvedConfirm = confirmLabel ?? t.modal.delete.confirm;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm pb-0 sm:pb-6"
        closeButtonClassName={closeButtonClassName}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-0 p-0 sm:flex-row sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <button
              type="button"
              disabled={isPending}
              className="text-ink disabled:text-ink-disabled w-full cursor-pointer py-3 disabled:cursor-not-allowed sm:w-auto sm:rounded-md sm:border sm:border-gray-300 sm:px-4 sm:py-2 sm:hover:bg-gray-50"
            >
              {resolvedCancel}
            </button>
          </DialogClose>
          <div className="h-[1px] w-full bg-gray-200 sm:hidden" />
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="w-full cursor-pointer py-3 font-bold text-red-600 disabled:cursor-not-allowed disabled:text-red-300 sm:w-auto sm:rounded-md sm:bg-red-50 sm:px-4 sm:py-2 sm:hover:bg-red-100"
          >
            {isPending ? (pendingLabel ?? resolvedConfirm) : resolvedConfirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
