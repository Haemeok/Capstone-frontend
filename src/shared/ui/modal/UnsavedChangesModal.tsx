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

type UnsavedChangesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const UnsavedChangesModal = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: UnsavedChangesModalProps) => {
  const t = useCommonDict();

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm pb-0">
        <DialogHeader>
          <DialogTitle>{t.modal.unsavedChanges.title}</DialogTitle>
          <DialogDescription>
            {t.modal.unsavedChanges.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-0 space-x-2">
          <DialogClose asChild>
            <button
              className="text-ink my-2 rounded-md px-4"
              onClick={handleCancel}
            >
              {t.modal.unsavedChanges.cancel}
            </button>
          </DialogClose>
          <div className="h-[1px] w-full bg-gray-200"></div>
          <button
            className="my-2 rounded-md px-4 font-bold text-red-600"
            onClick={handleConfirm}
          >
            {t.modal.unsavedChanges.leave}
          </button>
          <div className="h-[1px] w-full bg-gray-200"></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
