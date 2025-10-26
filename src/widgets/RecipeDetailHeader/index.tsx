"use client";

import { useRef } from "react";
import Link from "next/link";

import Ratings from "@/shared/ui/Ratings";

import { Recipe } from "@/entities/recipe/model/types";

import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";
import TransformingNavbar from "@/widgets/Header/TransformingNavbar";
import { OptimizedImage } from "@/shared/ui/image/OptimizedImage";

type RecipeDetailHeaderProps = {
  recipe: Recipe;
};

const RecipeDetailHeader = ({ recipe }: RecipeDetailHeaderProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

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

      <OptimizedImage
        ref={imageRef}
        src={recipe.imageUrl}
        alt={recipe.title}
        wrapperClassName="w-full"
        className="object-cover"
        fill
        priority
        fetchPriority="high"
      />

      <Link
        href={`/recipes/${recipe.id}/rate`}
        prefetch={false}
        className="block mt-4"
      >
        <Ratings
          precision={0.1}
          allowHalf
          value={recipe.ratingInfo.avgRating || 0}
          readOnly
          className="w-full justify-center"
          showValue
          ratingCount={recipe.ratingInfo.ratingCount}
        />
      </Link>
    </>
  );
};

export default RecipeDetailHeader;
