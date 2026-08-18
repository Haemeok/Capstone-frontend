"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import type { Locale } from "@/shared/i18n";

import { useCookingRecordsInfiniteQuery } from "@/entities/recipe";

import { buildMonthlyCookingRecordSummary } from "./buildMonthlyCookingRecordSummary";
import {
  getMonthlyCookingRecordItems,
  shouldFetchNextCookingRecordPage,
  toMonthlyCookingRecords,
} from "./cookingRecordPage.lib";
import { useStickerProcessingPolling } from "./useStickerProcessingPolling";

export const useMonthlyCookingRecords = ({
  enabled,
  monthKey,
  locale,
}: {
  enabled: boolean;
  monthKey: string;
  locale: Locale;
}) => {
  const { ref: sentinelRef } = useInView({
    rootMargin: "240px 0px",
  });
  const query = useCookingRecordsInfiniteQuery({ enabled });
  const groups = query.data?.pages.flatMap((page) => page.groups) ?? [];
  const items = getMonthlyCookingRecordItems(groups, monthKey);
  const records = toMonthlyCookingRecords(groups, monthKey, locale);
  const summary = buildMonthlyCookingRecordSummary(items);
  const hasProcessingSticker = items.some(
    ({ record }) => record.stickerStatus === "PROCESSING"
  );
  const shouldFetchNext = shouldFetchNextCookingRecordPage(
    groups,
    monthKey,
    query.hasNextPage ?? false
  );
  const { fetchNextPage, isFetchingNextPage } = query;

  useEffect(() => {
    if (shouldFetchNext && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, shouldFetchNext]);

  useStickerProcessingPolling({
    enabled,
    hasProcessingSticker,
    isFetching: query.isFetching,
    refetch: query.refetch,
  });

  const isMonthComplete =
    !query.isPending &&
    !query.isError &&
    !shouldFetchNext &&
    !isFetchingNextPage;

  return {
    background: query.data?.pages[0]?.background ?? null,
    items,
    records,
    summary,
    isMonthComplete,
    sentinelRef,
    shouldFetchNext,
    isPending: query.isPending,
    isError: query.isError,
    isFetchingNextPage,
    retry: query.refetch,
  };
};
