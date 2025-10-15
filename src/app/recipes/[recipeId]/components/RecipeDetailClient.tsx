"use client";

import { useRef } from "react";

import BadgeButton from "@/shared/ui/BadgeButton";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import { FabButton } from "@/shared/ui/FabButton";
import Box from "@/shared/ui/primitives/Box";

import { useRecipeDetailQuery } from "@/entities/recipe/model/hooks";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";
import { UserProfile } from "@/entities/user";

import { CommentCard } from "@/features/comment-card";

import RecipeDetailHeader from "@/widgets/RecipeDetailHeader";
import RecipeInteractionButtons from "@/widgets/RecipeInteractionButtons";

import CommentMoreButton from "./CommentMoreButton";
import IngredientsSection from "../components/IngredientsSection";

type RecipeDetailClientProps = { recipeId: number };

const RecipeDetailClient = ({ recipeId }: RecipeDetailClientProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const { recipeData: recipe } = useRecipeDetailQuery(recipeId);

  return (
    <div className="relative mx-auto flex flex-col">
      <RecipeDetailHeader recipe={recipe} />

      <div className="px-2">
        <Box className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-center text-2xl font-bold">{recipe.title}</h1>
            {recipe.aiGenerated && (
              <BadgeButton
                badgeText="AI의 도움을 받아 작성된 레시피예요"
                badgeIcon={<p>🧪</p>}
              />
            )}
          </div>

          <RecipeInteractionButtons recipe={recipe} />
        </Box>

        <Box>
          <UserProfile user={recipe.author} className="text-xl" />
          <CollapsibleP content={recipe.description} />
        </Box>

        <Box>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">코멘트</h2>
            <CommentMoreButton
              recipeId={recipe.id}
              text={recipe.comments.length > 0 ? "더 읽기" : "작성하기"}
            />
          </div>
          {recipe.comments.length > 0 ? (
            <CommentCard
              comment={recipe.comments[0]}
              recipeId={recipe.id}
              hideReplyButton
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 mt-4">
              <p className="text-sm text-gray-400">
                첫번째 댓글을 작성해보세요!
              </p>
            </div>
          )}
        </Box>
        <div ref={observerRef} className="h-1 w-full" />
        <IngredientsSection recipe={recipe} />

        <RecipeStepList RecipeSteps={recipe.steps} />
      </div>

      <FabButton
        to={`/recipes/${recipe.id}/slide-show`}
        text="요리하기"
        triggerRef={observerRef}
      />
    </div>
  );
};

export default RecipeDetailClient;
