import type { Metadata } from "next";

import {
  buildLocalizedRecipeMetadata,
  LocalizedRecipePage,
} from "@/widgets/RecipeDetailView/server/renderLocalizedRecipePage";

type Props = { params: Promise<{ recipeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recipeId } = await params;
  return buildLocalizedRecipeMetadata({ recipeId, locale: "en" });
}

export default async function EnRecipeDetailPage({ params }: Props) {
  const { recipeId } = await params;
  return <LocalizedRecipePage recipeId={recipeId} locale="en" />;
}
