import Link from "next/link";

import { OptimizedImage } from "@/shared/ui/image/OptimizedImage";
import Ratings from "@/shared/ui/Ratings";

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
    <>
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

      <Link
        href={`/recipes/${recipeId}/rate`}
        prefetch={false}
        className="block mt-4"
      >
        <Ratings
          precision={0.1}
          allowHalf
          value={avgRating || 0}
          readOnly
          className="w-full justify-center"
          showValue
          ratingCount={ratingCount}
        />
      </Link>
    </>
  );
}
