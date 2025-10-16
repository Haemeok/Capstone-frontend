import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type RecipeGridSkeletonProps = {
  count?: number;
  isSimple?: boolean;
};

const RecipeGridSkeleton = ({
  count = 6,
  isSimple = false,
}: RecipeGridSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) =>
        isSimple ? (
          <SimpleRecipeGridItemSkeleton key={index} />
        ) : (
          <DetailedRecipeGridItemSkeleton key={index} />
        )
      )}
    </>
  );
};

const DetailedRecipeGridItemSkeleton = () => {
  return (
    <div className="flex shrink-0 flex-col gap-2 rounded-2xl">
      <Skeleton className="aspect-square w-full rounded-2xl" />

      <div className="flex grow flex-col gap-0.5 px-2 pb-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-1 h-4 w-32" />
        <div className="mt-1 flex items-center gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};

const SimpleRecipeGridItemSkeleton = () => {
  return (
    <div className="relative rounded-2xl">
      <Skeleton className="aspect-square w-full rounded-2xl" />
    </div>
  );
};

export default RecipeGridSkeleton;
