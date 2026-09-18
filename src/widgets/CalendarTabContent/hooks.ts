"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  type CookingRecordListItem,
  useCookingRecordCalendarMonthQuery,
  useCookingRecordsInfiniteQuery,
} from "@/entities/recipe";
import { useAuthGate } from "@/entities/user";
import { getUserStreak } from "@/entities/user/model/api";

export const useUserStreakQuery = () => {
  const authGate = useAuthGate();
  return useQuery({
    queryKey: ["userStreak"],
    queryFn: getUserStreak,
    enabled: authGate,
  });
};

const getOldestLoadedMonth = (dates: string[]) =>
  dates.reduce<string | null>((oldest, date) => {
    const month = date.slice(0, 7);
    return oldest === null || month < oldest ? month : oldest;
  }, null);

export const useProfileCookingRecords = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const enabled = useAuthGate();
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const listQuery = useCookingRecordsInfiniteQuery({ enabled });
  const calendarQuery = useCookingRecordCalendarMonthQuery({
    year,
    month,
    enabled,
  });
  const groups = listQuery.data?.pages.flatMap((page) => page.groups) ?? [];
  const records = groups.flatMap((group) =>
    group.date.startsWith(monthKey) ? group.records : []
  );
  const stickerImageUrlByDate: Record<string, string> = {};
  const displayRecordByDate: Record<string, CookingRecordListItem> = {};

  for (const group of groups) {
    if (!group.date.startsWith(monthKey)) continue;

    const firstReadySticker = group.records.find(
      (record) =>
        record.stickerStatus === "READY" && record.stickerImageUrl !== null
    );

    if (firstReadySticker?.stickerImageUrl) {
      stickerImageUrlByDate[group.date] = firstReadySticker.stickerImageUrl;
    }

    const firstDisplayRecord = group.records.find((record) =>
      Boolean(
        record.croppedImageUrl ?? record.stickerImageUrl ?? record.imageUrl
      )
    );
    if (firstDisplayRecord)
      displayRecordByDate[group.date] = firstDisplayRecord;
  }
  const oldestMonth = getOldestLoadedMonth(groups.map((group) => group.date));
  const shouldFetchNext =
    Boolean(listQuery.hasNextPage) &&
    (oldestMonth === null || oldestMonth >= monthKey);
  const hasProcessingSticker = records.some(
    (record) => record.stickerStatus === "PROCESSING"
  );
  const { fetchNextPage, isFetchingNextPage, refetch } = listQuery;

  useEffect(() => {
    if (shouldFetchNext && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, shouldFetchNext]);

  useEffect(() => {
    if (!hasProcessingSticker) return;
    const timer = window.setInterval(() => {
      if (!listQuery.isFetching) void refetch();
    }, 2_000);
    return () => window.clearInterval(timer);
  }, [hasProcessingSticker, listQuery.isFetching, refetch]);

  return {
    background: listQuery.data?.pages[0]?.background ?? null,
    records,
    stickerImageUrlByDate,
    displayRecordByDate,
    dailySummaries: calendarQuery.data?.dailySummaries ?? [],
    hasCalendarData: calendarQuery.data !== undefined,
    isPreviewPending:
      listQuery.isPending || shouldFetchNext || listQuery.isFetchingNextPage,
    isPreviewError: listQuery.isError,
    retryPreview: listQuery.refetch,
  };
};
