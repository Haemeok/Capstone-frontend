"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TRENDING_RECIPES = [
  {
    title: "임성근 제육볶음",
    url: "https://www.youtube.com/watch?v=EEc7AwJKAuc",
    videoId: "EEc7AwJKAuc",
  },
  {
    title: "임성근 짜글이",
    url: "https://www.youtube.com/watch?v=sMFjET_qDLc",
    videoId: "sMFjET_qDLc",
  },
  {
    title: "강레오 김치찌개",
    url: "https://www.youtube.com/watch?v=_rYksZ2KBPY",
    videoId: "_rYksZ2KBPY",
  },
  {
    title: "강레오 고추장찌개",
    url: "https://www.youtube.com/watch?v=joLhhFXFGzo",
    videoId: "joLhhFXFGzo",
  },
  {
    title: "강레오 볼로네제 파스타",
    url: "https://www.youtube.com/watch?v=NAeoN80QCUE",
    videoId: "NAeoN80QCUE",
  },
  {
    title: "강레오 셰프 드레싱 레시피",
    url: "https://www.youtube.com/watch?v=Lyx4whidkjM",
    videoId: "Lyx4whidkjM",
  },
  {
    title: "성시경 브리치즈 파스타",
    url: "https://www.youtube.com/watch?v=q3q8MdSDa6M",
    videoId: "q3q8MdSDa6M",
  },
];

const CARD_WIDTH = 160;
const CARD_GAP = 16;
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

type TrendingRecipesProps = {
  onSelect: (url: string) => void;
  className?: string;
};

export const TrendingRecipes = ({
  onSelect,
  className,
}: TrendingRecipesProps) => {
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
  }, []);

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
        <span className="text-lg font-semibold">요즘 뜨는 레시피</span>
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
        className="scrollbar-hide flex gap-4 overflow-x-auto px-1 pb-4 md:px-0"
      >
        {TRENDING_RECIPES.map((recipe) => (
          <button
            key={recipe.videoId}
            onClick={() => onSelect(recipe.url)}
            className="group w-40 flex-shrink-0 text-left"
          >
            <div className="group-hover:border-olive-light relative mb-2 aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 transition-colors">
              <Image
                src={`https://img.youtube.com/vi/${recipe.videoId}/mqdefault.jpg`}
                alt={recipe.title}
                width={160}
                height={90}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
            <p className="group-hover:text-olive line-clamp-2 text-sm leading-tight font-medium text-gray-900">
              {recipe.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
