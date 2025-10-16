import { Skeleton } from "@/shared/ui/shadcn/skeleton";

const NotificationSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 bg-white rounded-lg border"
        >
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="w-6 h-6" />
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;