"use client";

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

  return (
    <div className="fixed bottom-20 left-0 right-0 z-header flex justify-center sticky-optimized">
      <div className="w-full max-w-4xl px-4 md:px-6 flex justify-center">
        <Button
          onClick={onDelete}
          className="bg-olive-light rounded-full px-6 py-4 text-white shadow-lg hover:bg-olive-light/90"
        >
          {selectedCount}개 선택 · 재료 삭제
        </Button>
      </div>
    </div>
  );
};

export default DeleteModeFabButton;
