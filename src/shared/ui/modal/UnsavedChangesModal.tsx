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
          <DialogTitle>저장하지 않고 나가시겠어요?</DialogTitle>
          <DialogDescription>
            작성 중인 내용이 저장되지 않습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-0 space-x-2">
          <DialogClose asChild>
            <button
              className="my-2 rounded-md px-4 text-gray-800"
              onClick={handleCancel}
            >
              취소
            </button>
          </DialogClose>
          <div className="h-[1px] w-full bg-gray-200"></div>
          <button
            className="my-2 rounded-md px-4 font-bold text-red-600"
            onClick={handleConfirm}
          >
            나가기
          </button>
          <div className="h-[1px] w-full bg-gray-200"></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
