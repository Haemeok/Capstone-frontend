"use client";

import { OptimizedImage } from "@/shared/ui/image/OptimizedImage";

import { useRecipeContainer } from "./RecipeContainer";

type RecipeHeroImageProps = {
  src: string;
  alt: string;
};

export default function RecipeHeroImage({ src, alt }: RecipeHeroImageProps) {
  const { imageRef } = useRecipeContainer();

  return (
    <OptimizedImage
      ref={imageRef}
      src={src}
      alt={alt}
      wrapperClassName="w-full"
      className="object-cover"
      fill
      priority
      fetchPriority="high"
    />
  );
}
