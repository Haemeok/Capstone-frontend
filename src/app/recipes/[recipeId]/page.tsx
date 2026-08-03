import type { Metadata } from "next";

import {
  buildRecipeMetadata,
  RecipeDetailPageView,
} from "./RecipeDetailPageView";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export const generateStaticParams = () => [];

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  return buildRecipeMetadata(recipeId);
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;
  return <RecipeDetailPageView recipeId={recipeId} renderTrack="static" />;
}
