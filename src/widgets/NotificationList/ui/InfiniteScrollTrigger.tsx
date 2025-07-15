import { forwardRef } from "react";

type InfiniteScrollTriggerProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const InfiniteScrollTrigger = forwardRef<
  HTMLDivElement,
  InfiniteScrollTriggerProps
>(({ hasNextPage, isFetchingNextPage }, ref) => {
  if (!hasNextPage) return null;

  return (
    <div ref={ref} className="p-4 text-center">
      {isFetchingNextPage ? (
        <div className="text-gray-500 text-sm">
          <div className="animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span>더 많은 알림을 불러오는 중...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          스크롤하여 더 많은 알림 보기
        </div>
      )}
    </div>
  );
});
