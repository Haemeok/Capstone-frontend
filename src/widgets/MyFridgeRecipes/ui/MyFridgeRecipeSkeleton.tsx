import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type MyFridgeRecipeSkeletonProps = {
  count?: number;
};

const MyFridgeRecipeSkeleton = ({ count = 3 }: MyFridgeRecipeSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-2xl bg-white p-3"
        >
          <Skeleton className="h-28 w-28 flex-shrink-0 rounded-xl min-[390px]:h-32 min-[390px]:w-32" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-1 flex gap-1.5">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MyFridgeRecipeSkeleton;
