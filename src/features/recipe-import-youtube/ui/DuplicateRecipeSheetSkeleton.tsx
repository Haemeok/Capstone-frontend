import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type DuplicateRecipeSheetSkeletonProps = {
  isMobile: boolean;
};

export const DuplicateRecipeSheetSkeleton = ({
  isMobile,
}: DuplicateRecipeSheetSkeletonProps) => (
  <div
    data-testid="duplicate-recipe-skeleton"
    className="flex min-h-0 flex-1 flex-col"
  >
    <Skeleton
      className={`${isMobile ? "aspect-[16/10]" : "aspect-[16/9]"} w-full rounded-none`}
    />
    <div className="flex-1 space-y-3 px-5 py-4">
      <Skeleton className="h-5 w-2/5 rounded-lg" />
      <Skeleton className="h-6 w-4/5 rounded-lg" />
      <Skeleton className="h-4 w-1/4 rounded-lg" />
    </div>
    <div className="grid grid-cols-[1fr_1.6fr] gap-2 border-t border-gray-100 p-4">
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);
