import Link from "next/link";

import { ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

type RecipeSlideProps = {
  title: string;
  to?: string;
  recipes: DetailedRecipeGridItemType[];
  isLoading: boolean;
  error: Error | null;
};

const RecipeSlide = ({
  title,
  to,
  recipes,
  isLoading,
  error,
}: RecipeSlideProps) => {
  return (
    <div className="mt-2 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {to ? (
          <Link
            href={to}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            더보기
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="flex items-center text-sm text-gray-400 cursor-not-allowed opacity-50">
            더보기
            <ChevronRight size={16} />
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex w-full gap-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <Skeleton className="h-[200px] w-[200px] rounded-xl " />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex w-full h-30 items-center justify-center py-8">
          <p className="text-sm text-gray-500">
            잠시 서버에 문제가 있어요. 나중에 다시 시도해주세요.
          </p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex w-full items-center justify-center py-8">
          <p className="text-sm text-gray-500">아직 레시피가 없어요.</p>
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {recipes.map((item) => (
              <CarouselItem key={item.id} className="pl-3 basis-[200px]">
                <DetailedRecipeGridItem recipe={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      )}
    </div>
  );
};

export default RecipeSlide;
