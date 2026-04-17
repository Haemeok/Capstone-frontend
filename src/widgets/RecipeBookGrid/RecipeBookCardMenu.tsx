"use client";

import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

import { DeleteRecipeBookModal } from "@/features/recipe-book-delete";
import { RenameRecipeBookSheet } from "@/features/recipe-book-rename";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

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
            className="absolute right-2 top-2 rounded-full bg-white/80 p-1 backdrop-blur transition-colors hover:bg-white"
            aria-label="폴더 메뉴"
          >
            <MoreVerticalIcon size={18} className="text-gray-700" />
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
