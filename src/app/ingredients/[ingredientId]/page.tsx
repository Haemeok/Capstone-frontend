import { notFound } from "next/navigation";

import {
  IngredientDetailPageClient,
  getIngredientDetail,
  getIngredientRecipes,
} from "@/widgets/IngredientDetailPage";

type IngredientDetailPageProps = {
  params: Promise<{ ingredientId: string }>;
};

const IngredientDetailPage = async ({ params }: IngredientDetailPageProps) => {
  const { ingredientId } = await params;
  const detail = getIngredientDetail(ingredientId);

  if (!detail) {
    notFound();
  }

  const recipes = getIngredientRecipes(ingredientId);

  return <IngredientDetailPageClient detail={detail} recipes={recipes} />;
};

export default IngredientDetailPage;
