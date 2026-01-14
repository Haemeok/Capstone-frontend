import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TrendingRecipesSkeletonProps = {
  className?: string;
};

export const TrendingRecipesSkeleton = ({
  className,
}: TrendingRecipesSkeletonProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-lg font-semibold">요즘 뜨는 레시피</span>
        <div className="flex gap-2">
          <button
            disabled
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 opacity-40 cursor-not-allowed"
            aria-label="이전"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            disabled
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 opacity-40 cursor-not-allowed"
            aria-label="다음"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-1 pb-4 md:px-0">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="w-40 flex-shrink-0">
            <Skeleton className="mb-2 aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="mt-1 h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
