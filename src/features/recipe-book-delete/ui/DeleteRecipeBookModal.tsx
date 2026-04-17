"use client";

import {
  useDeleteRecipeBook,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";
import { useToastStore } from "@/widgets/Toast/model/store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookName: string;
  onDeleted?: () => void;
};

export const DeleteRecipeBookModal = ({
  open,
  onOpenChange,
  bookId,
  bookName,
  onDeleted,
}: Props) => {
  const deleteMutation = useDeleteRecipeBook();
  const addToast = useToastStore((state) => state.addToast);

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(bookId);
      addToast({
        message: `"${bookName}" 폴더가 삭제되었어요`,
        variant: "success",
      });
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      addToast({
        message: getRecipeBookErrorMessage(error),
        variant: "error",
      });
    }
  };

  return (
    <DeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title={`"${bookName}" 폴더를 삭제할까요?`}
      description="이 폴더에만 저장된 레시피는 저장 목록에서도 사라져요."
      confirmLabel="삭제"
      cancelLabel="취소"
      onConfirm={handleConfirm}
    />
  );
};
