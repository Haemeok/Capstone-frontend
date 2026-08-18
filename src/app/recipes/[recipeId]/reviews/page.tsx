import { renderRecipeReviewsPage } from "./renderRecipeReviewsPage";

type RecipeReviewsPageProps = {
  params: Promise<{ recipeId: string }>;
};

const RecipeReviewsPage = async ({ params }: RecipeReviewsPageProps) => {
  const { recipeId } = await params;
  return renderRecipeReviewsPage({ recipeId });
};

export default RecipeReviewsPage;
