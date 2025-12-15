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
      <div
        id="recipe-hero-image"
        className="relative w-full max-w-[550px] overflow-hidden md:mt-4 md:w-1/2 md:rounded-2xl"
      >
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-32 bg-gradient-to-b from-black/60 to-transparent md:hidden" />
        <OptimizedImage
          src={imageUrl}
          alt={title}
          wrapperClassName="w-full md:rounded-2xl"
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
