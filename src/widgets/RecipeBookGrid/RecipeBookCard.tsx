"use client";

import { useRouter } from "next/navigation";

import { useRecipeBookDetail } from "@/entities/recipe-book";

import { RecipeBookCardMenu } from "./RecipeBookCardMenu";
import { RecipeBookThumbnailGrid } from "./RecipeBookThumbnailGrid";

const PREVIEW_RECIPE_COUNT = 4;

type Props = {
  bookId: string;
  name: string;
  recipeCount: number;
  isDefault: boolean;
};

export const RecipeBookCard = ({
  bookId,
  name,
  recipeCount,
  isDefault,
}: Props) => {
  const router = useRouter();
  const { data } = useRecipeBookDetail(bookId);

  const previewRecipes = data?.recipes.slice(0, PREVIEW_RECIPE_COUNT) ?? [];

  const handleClick = () => {
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
          <p className="truncate text-base font-bold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">저장된 레시피 {recipeCount}개</p>
        </div>
        {!isDefault && (
          <RecipeBookCardMenu bookId={bookId} bookName={name} />
        )}
      </div>
    </div>
  );
};
