"use client";

import { format, useUserPagesDict, useUserPagesLocale } from "@/shared/i18n";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";
import { useToastStore } from "@/shared/ui/toast/model/store";

import {
  getRecipeBookError,
  useDeleteRecipeBook,
} from "@/entities/recipe-book";

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
  const t = useUserPagesDict().recipeBooks;
  const locale = useUserPagesLocale();
  const deleteMutation = useDeleteRecipeBook();
  const addToast = useToastStore((state) => state.addToast);

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(bookId);
      addToast({
        message: format(t.deleteBook.toast, { name: bookName }),
        variant: "success",
      });
      onOpenChange(false);
      onDeleted?.();
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
      title={format(t.deleteBook.title, { name: bookName })}
      description={t.deleteBook.description}
      confirmLabel={t.deleteBook.confirm}
      cancelLabel={t.deleteBook.cancel}
      onConfirm={handleConfirm}
    />
  );
};
