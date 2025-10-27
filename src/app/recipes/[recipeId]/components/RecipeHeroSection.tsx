import Link from "next/link";

import Ratings from "@/shared/ui/Ratings";

import RecipeHeroImage from "./RecipeHeroImage";

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
      <RecipeHeroImage src={imageUrl} alt={title} />

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
