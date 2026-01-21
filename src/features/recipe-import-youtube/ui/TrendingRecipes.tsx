"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTrendingYoutubeRecipesQuery } from "@/entities/recipe";

const CARD_WIDTH = 160;
const CARD_GAP = 16;
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

const formatViewCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }
  return count.toString();
};

type TrendingRecipesProps = {
  onSelect: (url: string) => void;
  className?: string;
};

export const TrendingRecipes = ({
  onSelect,
  className,
}: TrendingRecipesProps) => {
  const { data: trendingRecipes = [] } = useTrendingYoutubeRecipesQuery();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [trendingRecipes]);

  const handlePrev = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
    setTimeout(updateScrollButtons, 300);
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
    setTimeout(updateScrollButtons, 300);
  };

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xl font-semibold">요즘 뜨는 레시피</span>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="이전"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canScrollRight}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="다음"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="scrollbar-hide flex items-start gap-4 overflow-x-auto px-1 pb-4 md:px-0"
      >
        {trendingRecipes.length === 0 ? (
          <p className="w-full py-8 text-center text-sm text-gray-500">
            추천 레시피가 없습니다.
          </p>
        ) : (
          trendingRecipes.map((recipe) => (
            <button
              key={recipe.videoId}
              onClick={() => onSelect(recipe.videoUrl)}
              className="group w-40 flex-shrink-0 text-left"
            >
              <div className="group-hover:border-olive-light relative mb-2 aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 transition-colors">
                <Image
                  src={recipe.thumbnailUrl}
                  alt={recipe.title}
                  width={160}
                  height={90}
                  aspectRatio="16 / 9"
                  wrapperClassName="absolute inset-0"
                  imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </div>
              <div className="space-y-0.5">
                <p className="group-hover:text-olive line-clamp-2 leading-tight font-medium text-gray-900">
                  {recipe.title}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {recipe.channelName}
                </p>
                <p className="text-sm text-gray-400">
                  조회수 {formatViewCount(recipe.viewCount)}회
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
