"use client";

import { useRouter } from "next/navigation";

import { useRecipeBookDetail, useUnseenImportStore } from "@/entities/recipe-book";

import { RecipeBookCardMenu } from "./RecipeBookCardMenu";
import { RecipeBookThumbnailGrid } from "./RecipeBookThumbnailGrid";

const PREVIEW_RECIPE_COUNT = 4;

type Props = {
  bookId: string;
  name: string;
  recipeCount: number;
  isDefault: boolean;
  isFirstCard?: boolean;
};

export const RecipeBookCard = ({
  bookId,
  name,
  recipeCount,
  isDefault,
  isFirstCard = false,
}: Props) => {
  const router = useRouter();
  const { data } = useRecipeBookDetail(bookId);
  const hasUnseenImport = useUnseenImportStore((s) => s.hasUnseenImport);
  const clearUnseen = useUnseenImportStore((s) => s.clearUnseen);

  const showDot = isFirstCard && hasUnseenImport;

  const previewRecipes = data?.recipes.slice(0, PREVIEW_RECIPE_COUNT) ?? [];

  const handleClick = () => {
    if (showDot) clearUnseen();
    router.push(`/recipe-books/${bookId}`);
  };

  return (
    <div className="group">
      <button
        type="button"
        onClick={handleClick}
        className="block w-full cursor-pointer text-left"
      >
        <RecipeBookThumbnailGrid recipes={previewRecipes} />
      </button>
      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[15px] font-bold text-gray-900">{name}</p>
            {showDot && (
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
              />
            )}
          </div>
          <p className="text-[13px] text-gray-500">저장된 레시피 {recipeCount}개</p>
        </div>
        {!isDefault && (
          <RecipeBookCardMenu bookId={bookId} bookName={name} />
        )}
      </div>
    </div>
  );
};
