import { Image } from "@/shared/ui/image/Image";

import RecipeRatingButton from "./RecipeRatingButton";

type RecipeHeroSectionProps = {
  imageUrl: string;
  title: string;
  avgRating: number;
  ratingCount: number;
};

export default function RecipeHeroSection({
  imageUrl,
  title,
  avgRating,
  ratingCount,
}: RecipeHeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center bg-white">
      <div
        id="recipe-hero-image"
        className="relative aspect-square w-full overflow-hidden sm:max-w-[768px] md:mt-4 md:aspect-auto md:w-1/2 md:max-w-[550px] md:rounded-2xl"
      >
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-32 bg-gradient-to-b from-black/60 to-transparent md:hidden" />
        <Image
          src={imageUrl}
          alt={title}
          wrapperClassName="w-full h-full md:rounded-2xl"
          fit="cover"
          priority
        />
      </div>

      <RecipeRatingButton avgRating={avgRating} ratingCount={ratingCount} />
    </section>
  );
}
