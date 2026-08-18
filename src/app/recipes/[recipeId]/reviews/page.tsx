import type { Metadata } from "next";

import { renderRecipeReviewsPage } from "./renderRecipeReviewsPage";

export const metadata: Metadata = {
  title: "만들어봤어요",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

type RecipeReviewsPageProps = {
  params: Promise<{ recipeId: string }>;
};

const RecipeReviewsPage = async ({ params }: RecipeReviewsPageProps) => {
  const { recipeId } = await params;
  return renderRecipeReviewsPage({ recipeId });
};

export default RecipeReviewsPage;
