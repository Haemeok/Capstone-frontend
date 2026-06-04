"use client";

import { motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Button } from "@/shared/ui/shadcn/button";

type DeleteModeFabButtonProps = {
  selectedCount: number;
  onDelete: () => void;
};

const DeleteModeFabButton = ({
  selectedCount,
  onDelete,
}: DeleteModeFabButtonProps) => {
  if (selectedCount === 0) {
    return null;
  }

  const handleDelete = () => {
    triggerHaptic("Medium");
    onDelete();
  };

  return (
    <motion.div
      className="sticky-optimized z-header fixed right-0 bottom-20 left-0 flex justify-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="flex w-full max-w-4xl justify-center px-4 md:px-6">
        <Button
          onClick={handleDelete}
          className="bg-olive-light hover:bg-olive-light/90 h-14 cursor-pointer rounded-full px-8 text-base font-bold text-white shadow-xl transition-all active:scale-[0.98]"
        >
          {selectedCount}개 선택 · 재료 삭제
        </Button>
      </div>
    </motion.div>
  );
};

export default DeleteModeFabButton;
