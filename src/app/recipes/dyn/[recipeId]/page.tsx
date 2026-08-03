import type { Metadata } from "next";

import {
  buildRecipeMetadata,
  RecipeDetailPageView,
} from "../../[recipeId]/RecipeDetailPageView";

export const dynamic = "force-dynamic";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  return buildRecipeMetadata(recipeId);
}

export default async function RecipeDetailDynamicPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;
  return <RecipeDetailPageView recipeId={recipeId} renderTrack="dynamic" />;
}
