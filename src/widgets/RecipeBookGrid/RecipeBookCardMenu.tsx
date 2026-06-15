"use client";

import { useState } from "react";

import { MoreVerticalIcon } from "lucide-react";

import { useUserPagesDict } from "@/shared/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

import { DeleteRecipeBookModal } from "@/features/recipe-book-delete";
import { RenameRecipeBookSheet } from "@/features/recipe-book-rename";

type Props = {
  bookId: string;
  bookName: string;
};

export const RecipeBookCardMenu = ({ bookId, bookName }: Props) => {
  const t = useUserPagesDict().recipeBooks;
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="text-ink-muted shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
            aria-label={t.cardMenuAria}
          >
            <MoreVerticalIcon size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            {t.renameAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-500 focus:text-red-500"
          >
            {t.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameRecipeBookSheet
        open={renameOpen}
        onOpenChange={setRenameOpen}
        bookId={bookId}
        currentName={bookName}
      />
      <DeleteRecipeBookModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        bookId={bookId}
        bookName={bookName}
      />
    </>
  );
};
