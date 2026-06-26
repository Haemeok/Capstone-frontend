import type { Metadata } from "next";

import {
  buildLocalizedRecipeMetadata,
  LocalizedRecipePage,
} from "@/widgets/RecipeDetailView/server/renderLocalizedRecipePage";
import { RecipeDetailServerSlides } from "@/widgets/RecipeSlide/server";

type Props = { params: Promise<{ recipeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recipeId } = await params;
  return buildLocalizedRecipeMetadata({ recipeId, locale: "ja" });
}

export default async function JaRecipeDetailPage({ params }: Props) {
  const { recipeId } = await params;
  return (
    <LocalizedRecipePage
      recipeId={recipeId}
      locale="ja"
      bottomSlides={
        <RecipeDetailServerSlides recipeId={recipeId} locale="ja" />
      }
    />
  );
}
