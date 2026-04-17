"use client";

import { useState } from "react";

import { PencilIcon } from "lucide-react";

import PrevButton from "@/shared/ui/PrevButton";

import type { RecipeBook } from "@/entities/recipe-book";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";
import { RenameRecipeBookSheet } from "@/features/recipe-book-rename";

type Props = {
  book: RecipeBook;
};

export const RecipeBookDetailHeader = ({ book }: Props) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const selectedCount = useEditModeStore((s) => s.selectedIds.size);
  const enter = useEditModeStore((s) => s.enter);
  const exit = useEditModeStore((s) => s.exit);

  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4">
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {isEditMode ? (
            <PrevButton icon="close" onClick={exit} showOnDesktop />
          ) : (
            <PrevButton icon="back" showOnDesktop />
          )}
          {isEditMode ? (
            <span className="text-lg font-bold text-gray-900">
              {selectedCount}개 선택
            </span>
          ) : (
            <div className="flex min-w-0 items-center gap-1">
              <span className="truncate text-lg font-bold text-gray-900">
                {book.name}
              </span>
              {!book.isDefault && (
                <button
                  type="button"
                  onClick={() => setRenameOpen(true)}
                  className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  aria-label="이름 변경"
                >
                  <PencilIcon size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        {!isEditMode && (
          <button
            type="button"
            onClick={enter}
            className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            편집
          </button>
        )}
      </header>
      <RenameRecipeBookSheet
        open={renameOpen}
        onOpenChange={setRenameOpen}
        bookId={book.id}
        currentName={book.name}
      />
    </>
  );
};
