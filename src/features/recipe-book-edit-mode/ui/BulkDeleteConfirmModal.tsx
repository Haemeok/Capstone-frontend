"use client";

import { format, useUserPagesDict, useUserPagesLocale } from "@/shared/i18n";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import {
  getRecipeBookError,
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
  const t = useUserPagesDict().recipeBooks.bulkDelete;
  const locale = useUserPagesLocale();
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
        message: format(t.toast, { count }),
        variant: "success",
      });
      onOpenChange(false);
      exit();
    } catch (error) {
      addToast({
        message: getRecipeBookError(error, locale).message,
        variant: "error",
      });
    }
  };

  return (
    <DeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title={format(t.title, { count })}
      description={t.description}
      confirmLabel={t.confirm}
      cancelLabel={t.cancel}
      onConfirm={handleConfirm}
    />
  );
};
