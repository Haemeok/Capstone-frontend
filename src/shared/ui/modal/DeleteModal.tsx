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
      <DialogContent className="max-w-sm pb-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-0 space-x-2">
          <DialogClose asChild>
            <button className="my-2 rounded-md px-4 text-gray-800">
              {cancelLabel}
            </button>
          </DialogClose>
          <div className="h-[1px] w-full bg-gray-200"></div>
          <button
            className="my-2 rounded-md px-4 font-semibold text-red-600"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <div className="h-[1px] w-full bg-gray-200"></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
