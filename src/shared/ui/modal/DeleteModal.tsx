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
  description: string;
  onConfirm: () => Promise<void> | void;
  cancelLabel?: string;
  confirmLabel?: string;
};

export const DeleteModal = ({
  open,
  onOpenChange,
  title,
  description = "삭제 시 복구할 수 없습니다.",
  onConfirm,
  cancelLabel = "취소",
  confirmLabel = "삭제",
}: DeleteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm pb-0 sm:pb-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-0 p-0 sm:flex-row sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <button className="w-full py-3 text-gray-800 sm:w-auto sm:rounded-md sm:border sm:border-gray-300 sm:px-4 sm:py-2 sm:hover:bg-gray-50">
              {cancelLabel}
            </button>
          </DialogClose>
          <div className="h-[1px] w-full bg-gray-200 sm:hidden" />
          <button
            onClick={onConfirm}
            className="w-full py-3 font-bold text-red-600 sm:w-auto sm:rounded-md sm:bg-red-50 sm:px-4 sm:py-2 sm:hover:bg-red-100"
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
