"use client";

import { useRef } from "react";
import Link from "next/link";

import BadgeButton from "@/shared/ui/BadgeButton";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import { FabButton } from "@/shared/ui/FabButton";
import Ratings from "@/shared/ui/Ratings";
import Box from "@/shared/ui/primitives/Box";
import { OptimizedImage } from "@/shared/ui/image/OptimizedImage";

import { useRecipeStatusQuery } from "@/entities/recipe/model/hooks";
import { Recipe, StaticRecipe } from "@/entities/recipe/model/types";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";
import { UserProfile } from "@/entities/user";

import { CommentCard } from "@/features/comment-card";

import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";
import TransformingNavbar from "@/widgets/Header/TransformingNavbar";
import RecipeInteractionButtons from "@/widgets/RecipeInteractionButtons";

import CommentMoreButton from "./CommentMoreButton";
import IngredientsSection from "../components/IngredientsSection";

type RecipeDetailClientProps = {
  staticRecipe: StaticRecipe;
  recipeId: number;
};

const RecipeDetailClient = ({ staticRecipe, recipeId }: RecipeDetailClientProps) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { data: status } = useRecipeStatusQuery(recipeId);

  const recipe: Recipe = {
    ...staticRecipe,
    likeCount: status?.likeCount ?? 0,
    likedByCurrentUser: status?.likedByCurrentUser ?? false,
    favoriteByCurrentUser: status?.favoriteByCurrentUser ?? false,
    ratingInfo: {
      ...staticRecipe.ratingInfo,
      myRating: status?.myRating ?? 0,
    },
    comments: staticRecipe.comments.map((comment) => {
      const statusComment = status?.comments.find((c) => c.id === comment.id);
      return {
        ...comment,
        likedByCurrentUser: statusComment?.likedByCurrentUser ?? false,
        likeCount: statusComment?.likeCount ?? 0,
      };
    }),
  };

  return (
    <div className="relative mx-auto flex flex-col">
      <TransformingNavbar
        title={staticRecipe.title}
        targetRef={imageRef}
        titleThreshold={0.7}
        textColorThreshold={0.5}
        shadowThreshold={0.8}
        rightComponent={
          <RecipeNavBarButtons
            recipeId={recipeId}
            initialIsLiked={status?.likedByCurrentUser ?? false}
            initialLikeCount={status?.likeCount ?? 0}
          />
        }
      />

      <OptimizedImage
        ref={imageRef}
        src={staticRecipe.imageUrl}
        alt={staticRecipe.title}
        wrapperClassName="w-full"
        className="object-cover"
        fill
        priority
        fetchPriority="high"
      />

      <Link href={`/recipes/${recipeId}/rate`} prefetch={false} className="block mt-4">
        <Ratings
          precision={0.1}
          allowHalf
          value={staticRecipe.ratingInfo.avgRating || 0}
          readOnly
          className="w-full justify-center"
          showValue
          ratingCount={staticRecipe.ratingInfo.ratingCount}
        />
      </Link>

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
