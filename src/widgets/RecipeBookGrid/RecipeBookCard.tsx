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
    <div className="group relative cursor-pointer" onClick={handleClick}>
      <RecipeBookThumbnailGrid recipes={previewRecipes} />
      {!isDefault && <RecipeBookCardMenu bookId={bookId} bookName={name} />}
      <div className="mt-2 px-1">
        <p className="truncate text-base font-bold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">저장된 레시피 {recipeCount}개</p>
      </div>
    </div>
  );
};
