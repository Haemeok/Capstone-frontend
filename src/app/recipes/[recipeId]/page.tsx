import { notFound } from "next/navigation";

import { formatPrice } from "@/shared/lib/format";
import AIBadgeButton from "@/shared/ui/AIBadgeButton";
import Box from "@/shared/ui/Box";
import CollapsibleP from "@/shared/ui/CollapsibleP";

import { getRecipeOnServer } from "@/entities/recipe/model/api";
import { mockRecipeData } from "@/entities/recipe/model/mockData";
import { Recipe } from "@/entities/recipe/model/types";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";
import { UserProfile } from "@/entities/user";

import { CommentCard } from "@/features/comment-card";

import RecipeDetailHeader from "@/widgets/RecipeDetailHeader";
import RecipeInteractionButtons from "@/widgets/RecipeInteractionButtons";

import { CommentMoreButton } from "./components/CommentMoreButton";
import { CookButton } from "./components/CookButton";
import IngredientsSection from "./components/IngredientsSection";

interface RecipeDetailPageProps {
  params: Promise<{ recipeId: string }>;
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;
  const numericRecipeId = Number(recipeId);

  const recipe = await getRecipeOnServer(numericRecipeId);

  const useMockData =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const displayRecipe = useMockData ? mockRecipeData : recipe;

  if (!displayRecipe) {
    notFound();
  }

  const baseRecipe = displayRecipe as Recipe;

  return (
    <div className="relative mx-auto flex flex-col bg-[#ffffff] text-[#2a2229]">
      <RecipeDetailHeader recipe={baseRecipe} />

      <div className="px-2">
        <Box className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-center text-2xl font-bold">
              {baseRecipe.title}
            </h1>
            {baseRecipe.aiGenerated && <AIBadgeButton />}
          </div>

          <RecipeInteractionButtons recipe={baseRecipe} />
        </Box>

        <Box>
          <UserProfile user={baseRecipe.author} className="text-xl" />
          <CollapsibleP content={baseRecipe.description} />
        </Box>

        <Box>
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold">코멘트</h2>
            <CommentMoreButton recipeId={baseRecipe.id} />
          </div>
          {baseRecipe.comments.length > 0 && (
            <CommentCard
              comment={baseRecipe.comments[0]}
              recipeId={baseRecipe.id}
              hideReplyButton={true}
            />
          )}
        </Box>

        <IngredientsSection recipe={displayRecipe} />

        <RecipeStepList RecipeSteps={baseRecipe.steps} />
      </div>

      <CookButton recipeId={baseRecipe.id} />
    </div>
  );
}
