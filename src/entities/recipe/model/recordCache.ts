import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "@/shared/lib/query";

import type { RecordTimelineResponse } from "./record";

export const keepFirstRecordsTimelinePages = (
  queryClient: QueryClient
): void => {
  queryClient.setQueriesData<InfiniteData<RecordTimelineResponse, number>>(
    { queryKey: ["recordsTimeline"] },
    keepFirstInfinitePage
  );
};
