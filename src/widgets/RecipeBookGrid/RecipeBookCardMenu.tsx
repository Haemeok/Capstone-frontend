"use client";

import { useState } from "react";

import { MoreVerticalIcon } from "lucide-react";

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
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="레시피북 메뉴"
          >
            <MoreVerticalIcon size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-500 focus:text-red-500"
          >
            삭제
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
