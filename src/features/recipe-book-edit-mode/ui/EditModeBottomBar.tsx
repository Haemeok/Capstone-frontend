"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils";

import { useBookRecipeIds } from "@/entities/recipe-book";

import { useEditModeStore } from "../model/useEditModeStore";
import { BulkDeleteConfirmModal } from "./BulkDeleteConfirmModal";
import { MoveRecipesSheet } from "./MoveRecipesSheet";

type Props = {
  bookId: string;
};

export const EditModeBottomBar = ({ bookId }: Props) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const selectAll = useEditModeStore((s) => s.selectAll);
  const clear = useEditModeStore((s) => s.clear);

  const allRecipeIds = useBookRecipeIds(bookId);

  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!isEditMode) return null;

  const count = selectedIds.size;
  const total = allRecipeIds.length;
  const isAllSelected = total > 0 && count === total;
  const hasSelection = count > 0;

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clear();
    } else {
      selectAll(allRecipeIds);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-screen-md items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSelectAllToggle}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {isAllSelected ? "선택 해제" : "모두 선택"}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => setMoveOpen(true)}
              className={cn(
                "h-12 rounded-xl border px-6 text-base font-bold transition-all active:scale-[0.98]",
                hasSelection
                  ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-100 text-gray-300"
              )}
            >
              이동
            </button>
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => setDeleteOpen(true)}
              className={cn(
                "h-12 rounded-xl border px-6 text-base font-bold transition-all active:scale-[0.98]",
                hasSelection
                  ? "border-red-200 text-red-500 hover:bg-red-50"
                  : "cursor-not-allowed border-gray-100 text-gray-300"
              )}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      <MoveRecipesSheet
        open={moveOpen}
        onOpenChange={setMoveOpen}
        fromBookId={bookId}
      />
      <BulkDeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        bookId={bookId}
      />
    </>
  );
};
