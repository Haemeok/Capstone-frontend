"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import type { Locale } from "@/shared/i18n";

import { useCookingRecordsInfiniteQuery } from "@/entities/recipe";

import {
  shouldFetchNextCookingRecordPage,
  toMonthlyCookingRecords,
} from "./cookingRecordPage.lib";

export const useMonthlyCookingRecords = ({
  enabled,
  monthKey,
  locale,
}: {
  enabled: boolean;
  monthKey: string;
  locale: Locale;
}) => {
  const { ref: sentinelRef, inView } = useInView({
    rootMargin: "240px 0px",
  });
  const query = useCookingRecordsInfiniteQuery({ enabled });
  const groups = query.data?.pages.flatMap((page) => page.groups) ?? [];
  const records = toMonthlyCookingRecords(groups, monthKey, locale);
  const shouldFetchNext = shouldFetchNextCookingRecordPage(
    groups,
    monthKey,
    query.hasNextPage ?? false
  );
  const { fetchNextPage, isFetchingNextPage } = query;

  useEffect(() => {
    if (inView && shouldFetchNext && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView, isFetchingNextPage, shouldFetchNext]);

  return {
    records,
    sentinelRef,
    shouldFetchNext,
    isPending: query.isPending,
    isError: query.isError,
    isFetchingNextPage,
    retry: query.refetch,
  };
};
