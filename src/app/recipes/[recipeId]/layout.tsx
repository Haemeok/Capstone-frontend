type RecipeLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ recipeId: string }>;
};

export default async function RecipeLayout({
  children,
  params,
}: RecipeLayoutProps) {
  return <>{children}</>;
}
