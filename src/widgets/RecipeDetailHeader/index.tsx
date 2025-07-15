"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import Ratings from "@/shared/ui/Ratings";

import { Recipe } from "@/entities/recipe/model/types";

import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";
import TransformingNavbar from "@/widgets/Header/TransformingNavbar";

interface RecipeDetailHeaderProps {
  recipe: Recipe;
}

export default function RecipeDetailHeader({
  recipe,
}: RecipeDetailHeaderProps) {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);

  const handleNavigateToRating = () => {
    router.push(`/recipes/${recipe.id}/rate`);
  };

  return (
    <>
      <TransformingNavbar
        title={recipe.title}
        targetRef={imageRef}
        titleThreshold={0.7}
        textColorThreshold={0.5}
        shadowThreshold={0.8}
        rightComponent={
          <RecipeNavBarButtons
            recipeId={recipe.id}
            initialIsLiked={recipe.likedByCurrentUser}
            initialLikeCount={recipe.likeCount}
          />
        }
      />

      <div ref={imageRef} className="h-112 w-full">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="cursor-pointer mt-4" onClick={handleNavigateToRating}>
        <Ratings
          precision={0.1}
          allowHalf={true}
          value={recipe.ratingInfo.avgRating || 0}
          readOnly={true}
          className="w-full justify-center"
          showValue={true}
          ratingCount={recipe.ratingInfo.ratingCount}
        />
      </div>
    </>
  );
}
