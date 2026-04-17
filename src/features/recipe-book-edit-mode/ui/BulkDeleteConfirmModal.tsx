"use client";

import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import {
  getRecipeBookErrorMessage,
  useRemoveRecipesFromBook,
} from "@/entities/recipe-book";

import { useToastStore } from "@/widgets/Toast/model/store";

import { useEditModeStore } from "../model/useEditModeStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
};

export const BulkDeleteConfirmModal = ({
  open,
  onOpenChange,
  bookId,
}: Props) => {
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const exit = useEditModeStore((s) => s.exit);
  const removeMutation = useRemoveRecipesFromBook();
  const addToast = useToastStore((state) => state.addToast);
  const count = selectedIds.size;

  const handleConfirm = async () => {
    try {
      await removeMutation.mutateAsync({
        bookId,
        recipeIds: Array.from(selectedIds),
      });
      addToast({
        message: `${count}개 레시피를 레시피북에서 뺐어요`,
        variant: "success",
      });
      onOpenChange(false);
      exit();
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
      title={`선택한 ${count}개 레시피를 레시피북에서 뺄까요?`}
      description="다른 레시피북에 저장돼 있다면 그곳에는 그대로 남아있어요."
      confirmLabel="레시피북에서 빼기"
      cancelLabel="취소"
      onConfirm={handleConfirm}
    />
  );
};
