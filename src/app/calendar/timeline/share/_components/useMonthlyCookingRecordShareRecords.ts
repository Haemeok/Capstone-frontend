"use client";

import { useEffect } from "react";

import type { Locale } from "@/shared/i18n";

import { useCookingRecordsInfiniteQuery } from "@/entities/recipe";

import {
  getMonthlyCookingRecordItems,
  shouldFetchNextCookingRecordPage,
  toMonthlyCookingRecords,
} from "../../_components/cookingRecordPage.lib";

export const useMonthlyCookingRecordShareRecords = ({
  enabled,
  monthKey,
  locale,
}: {
  enabled: boolean;
  monthKey: string;
  locale: Locale;
}) => {
  const query = useCookingRecordsInfiniteQuery({ enabled });
  const groups = query.data?.pages.flatMap((page) => page.groups) ?? [];
  const items = getMonthlyCookingRecordItems(groups, monthKey);
  const records = toMonthlyCookingRecords(groups, monthKey, locale);
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

  return {
    background: query.data?.pages[0]?.background ?? null,
    totalCount: items.length,
    shareItems: records.map(({ record, sticker }) => ({
      id: sticker.id,
      title: sticker.title,
      imageUrl: sticker.imageUrl,
      imageAlt: sticker.imageAlt,
      record,
    })),
    isReady:
      !query.isPending &&
      !query.isError &&
      !shouldFetchNext &&
      !isFetchingNextPage,
    isPending: query.isPending || isFetchingNextPage || shouldFetchNext,
    isError: query.isError,
    retry: query.refetch,
  };
};
