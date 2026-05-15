"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { TrashIcon } from "@/shared/ui/icons";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import useDeleteRecipeMutation from "../model/hooks";

type DeleteRowActionProps = {
  recipeId: string;
  variant: "mobile" | "desktop";
  onBeforeOpen?: () => void;
};

const DeleteRowAction = ({
  recipeId,
  variant,
  onBeforeOpen,
}: DeleteRowActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteRecipe } = useDeleteRecipeMutation(recipeId);

  const isMobile = variant === "mobile";

  const handleOpenModal = () => {
    triggerHaptic("Light");
    onBeforeOpen?.();
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
        <p>삭제</p>
        {isMobile && <TrashIcon size={20} />}
      </button>
      <DeleteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="레시피를 삭제하시겠어요?"
        onConfirm={handleConfirm}
        description="이 레시피를 삭제하면 복원할 수 없습니다."
      />
    </>
  );
};

export default DeleteRowAction;
