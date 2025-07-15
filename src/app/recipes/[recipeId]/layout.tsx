import { notFound } from "next/navigation";

interface RecipeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ recipeId: string }>;
}

export default async function RecipeLayout({
  children,
  params,
}: RecipeLayoutProps) {
  const { recipeId } = await params;

  const numericRecipeId = Number(recipeId);
  if (!recipeId || isNaN(numericRecipeId) || numericRecipeId <= 0) {
    notFound();
  }

  return <>{children}</>;
}
