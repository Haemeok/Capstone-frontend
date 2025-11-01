import { OptimizedImage } from "@/shared/ui/image/OptimizedImage";

import RecipeRatingButton from "./RecipeRatingButton";

type RecipeHeroSectionProps = {
  imageUrl: string;
  title: string;
  avgRating: number;
  ratingCount: number;
  recipeId: number;
};

export default function RecipeHeroSection({
  imageUrl,
  title,
  avgRating,
  ratingCount,
  recipeId,
}: RecipeHeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div id="recipe-hero-image" className="w-full relative">
        <OptimizedImage
          src={imageUrl}
          alt={title}
          wrapperClassName="w-full"
          className="object-cover"
          fill
          priority
          fetchPriority="high"
        />
      </div>

      <RecipeRatingButton
        avgRating={avgRating}
        ratingCount={ratingCount}
        recipeId={recipeId}
      />
    </section>
  );
}
