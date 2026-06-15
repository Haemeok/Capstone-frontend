"use client";

import { useState } from "react";

import { PencilIcon } from "lucide-react";

import { format, useUserPagesDict } from "@/shared/i18n";
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
  const t = useUserPagesDict().recipeBooks;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {isEditMode ? (
            <PrevButton icon="close" onClick={exit} showOnDesktop />
          ) : (
            <PrevButton icon="back" showOnDesktop />
          )}
          {isEditMode ? (
            <span className="text-ink text-lg font-bold">
              {format(t.selectedCount, { count: selectedCount })}
            </span>
          ) : (
            <div className="flex min-w-0 items-center gap-1">
              <span className="text-ink truncate text-lg font-bold">
                {book.name}
              </span>
              {!book.isDefault && (
                <button
                  type="button"
                  onClick={() => setRenameOpen(true)}
                  className="text-ink-muted shrink-0 rounded-full p-1 hover:bg-gray-100"
                  aria-label={t.renameAria}
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
            className="text-ink-sub rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
          >
            {t.editButton}
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
