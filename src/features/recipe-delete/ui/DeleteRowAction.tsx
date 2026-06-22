"use client";

import { useState } from "react";

import { useCommonDict, useRecipeActionsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { TrashIcon } from "@/shared/ui/icons";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import useDeleteRecipeMutation from "../model/hooks";

type DeleteRowActionProps = {
  recipeId: string;
  variant: "mobile" | "desktop";
};

const DeleteRowAction = ({ recipeId, variant }: DeleteRowActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteRecipe } = useDeleteRecipeMutation(recipeId);
  const tc = useCommonDict();
  const t = useRecipeActionsDict();

  const isMobile = variant === "mobile";

  const handleOpenModal = () => {
    triggerHaptic("Light");
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    deleteRecipe();
  };

  return (
    <>
      <button
        type="button"
        className={
          isMobile
            ? "flex w-full cursor-pointer justify-between text-red-500"
            : "flex w-full cursor-pointer justify-center gap-2 px-6 py-4 text-red-500 transition-colors hover:bg-gray-50"
        }
        onClick={handleOpenModal}
      >
        {!isMobile && <TrashIcon size={20} />}
        <p>{tc.modal.delete.confirm}</p>
        {isMobile && <TrashIcon size={20} />}
      </button>
      <DeleteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={t.deleteModalTitle}
        onConfirm={handleConfirm}
        description={tc.modal.delete.description}
      />
    </>
  );
};

export default DeleteRowAction;
