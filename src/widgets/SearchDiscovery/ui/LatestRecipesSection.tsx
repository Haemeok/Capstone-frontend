"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

import type { StaticDetailedRecipeGridItem } from "@/entities/recipe/model/types";

const LATEST_HREF = "/search/results?sort=createdAt%2CDESC";

type LatestRecipesSectionProps = {
  recipes: StaticDetailedRecipeGridItem[];
};

const LatestRecipesSection = ({ recipes }: LatestRecipesSectionProps) => {
  if (recipes.length === 0) {
    return null;
  }

  const handleHaptic = () => triggerHaptic("Light");

  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          따끈따끈한 최신 레시피
        </h3>
        <Link
          href={LATEST_HREF}
          onClick={handleHaptic}
          className="flex items-center gap-0.5 text-sm font-medium text-gray-500 active:text-gray-700"
        >
          전체보기
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.2} />
        </Link>
      </header>

      <Carousel
        opts={{ align: "start", loop: false, dragFree: true, containScroll: "trimSnaps" }}
        className="-mx-4 px-4"
      >
        <CarouselContent className="-ml-3">
          {recipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="basis-auto pl-3">
              <Link
                href={`/recipes/${recipe.id}`}
                onClick={handleHaptic}
                className="block w-[140px] flex-shrink-0"
              >
                <div className="aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    aspectRatio="1 / 1"
                    fit="cover"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-tight text-gray-900">
                  {recipe.title}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 hidden md:flex" />
        <CarouselNext className="right-0 hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default LatestRecipesSection;
