import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

import { getRecordsTimeline } from "../api";
import { RecordTimelineResponse } from "../record";

const TIMELINE_PAGE_SIZE = 20;

export const useRecordsTimelineInfiniteQuery = (
  size: number = TIMELINE_PAGE_SIZE
) => {
  const getTimelineNextPageParam = (
    lastPage: RecordTimelineResponse,
    _allPages: RecordTimelineResponse[],
    lastPageParam: number
  ) => (lastPage.hasNext ? lastPageParam + 1 : null);

  const {
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    data,
    error,
    isPending,
  } = useInfiniteScroll({
    queryKey: ["recordsTimeline", size],
    queryFn: ({ pageParam }) => getRecordsTimeline({ page: pageParam, size }),
    getNextPageParam: getTimelineNextPageParam,
    initialPageParam: 0,
  });

  const groups = data?.pages.flatMap((page) => page.groups) ?? [];
  const noResults = groups.length === 0 && !isPending;

  return {
    groups,
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    noResults,
    isPending,
  };
};
