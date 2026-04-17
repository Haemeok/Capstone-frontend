"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";

export const CreateRecipeBookCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-olive-light hover:text-olive-light"
          aria-label="폴더 만들기"
        >
          <PlusIcon size={32} />
        </button>
        <div className="mt-2 px-1">
          <p className="text-base font-bold text-gray-400">폴더 만들기</p>
        </div>
      </div>
      <CreateRecipeBookSheet open={open} onOpenChange={setOpen} />
    </>
  );
};
