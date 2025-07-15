type LoadingSkeletonProps = {
  count?: number;
};

export const LoadingSkeleton = ({ count = 3 }: LoadingSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 border-b border-gray-100">
          <div className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
