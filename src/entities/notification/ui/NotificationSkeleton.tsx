import { Skeleton } from "@/shared/ui/shadcn/skeleton";

const NotificationSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border bg-white p-4"
        >
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
