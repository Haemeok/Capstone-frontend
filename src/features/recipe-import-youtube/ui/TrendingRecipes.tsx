"use client";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

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
    title: "백종원 김치찌개",
    url: "https://www.youtube.com/watch?v=PjFKQe4W8ms",
    videoId: "PjFKQe4W8ms",
  },
  {
    title: "성시경 브리치즈 파스타",
    url: "https://www.youtube.com/watch?v=XhI2mGj2M4c",
    videoId: "XhI2mGj2M4c",
  },
];

type TrendingRecipesProps = {
  onSelect: (url: string) => void;
  className?: string;
};

export const TrendingRecipes = ({
  onSelect,
  className,
}: TrendingRecipesProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-2xl overflow-hidden", className)}>
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="text-sm font-semibold text-red-500">
          🔥 요즘 뜨는 레시피
        </span>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-1 pb-4">
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
