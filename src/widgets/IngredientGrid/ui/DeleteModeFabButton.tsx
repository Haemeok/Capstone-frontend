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
      className="sticky-optimized fixed bottom-20 left-0 right-0 z-header flex justify-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="flex w-full max-w-4xl justify-center px-4 md:px-6">
        <Button
          onClick={handleDelete}
          className="h-14 cursor-pointer rounded-full bg-olive-light px-8 text-base font-bold text-white shadow-xl transition-all hover:bg-olive-light/90 active:scale-[0.98]"
        >
          {selectedCount}개 선택 · 재료 삭제
        </Button>
      </div>
    </motion.div>
  );
};

export default DeleteModeFabButton;
