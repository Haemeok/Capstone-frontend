"use client";

import { useRecipeImageCheck } from "../hooks/useRecipeImageCheck";
import RecipeRatingButton from "./RecipeRatingButton";

type RecipeHeroSectionProps = {
  recipeId: string;
  imageUrl: string | null;
  title: string;
  avgRating: number;
  ratingCount: number;
};

const HERO_NATURAL_SIZE = 1024;

const RecipeHeroSection = ({
  recipeId,
  imageUrl: initialImageUrl,
  title,
  avgRating,
  ratingCount,
}: RecipeHeroSectionProps) => {
  const { imageUrl } = useRecipeImageCheck({ recipeId, initialImageUrl });

  return (
    <section className="flex flex-col items-center justify-center bg-white">
      <div
        id="recipe-hero-image"
        className="relative aspect-square w-full overflow-hidden sm:mx-auto sm:max-w-[550px] md:mt-4 md:w-1/2 md:max-w-[550px] md:rounded-2xl"
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            width={HERO_NATURAL_SIZE}
            height={HERO_NATURAL_SIZE}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover md:rounded-2xl"
          />
        )}
      </div>

      <RecipeRatingButton avgRating={avgRating} ratingCount={ratingCount} />
    </section>
  );
};

export default RecipeHeroSection;
