import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type IngredientGridSkeletonProps = {
  count?: number;
};

const IngredientGridSkeleton = ({
  count = 4,
}: IngredientGridSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm"
        >
          <Skeleton className="h-[60px] w-[60px] flex-shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </>
  );
};

export default IngredientGridSkeleton;
