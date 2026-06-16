import type { Metadata } from "next";

import {
  privateRecipeMetadata,
  PrivateRecipePage,
} from "@/widgets/RecipeDetailView/server/renderPrivateRecipePage";

type Props = { params: Promise<{ recipeId: string }> };

export const metadata: Metadata = privateRecipeMetadata;

export default async function Page({ params }: Props) {
  const { recipeId } = await params;
  return <PrivateRecipePage recipeId={recipeId} locale="en" />;
}
