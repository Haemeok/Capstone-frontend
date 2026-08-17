"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useUserPagesLocale } from "@/shared/i18n";

import type { RecordSourceType } from "../record";
import { getCookingRecords } from "../recordApi";
import { COOKING_RECORD_QUERY_KEYS } from "../recordQueryKeys";

const DEFAULT_RECORD_LIST_SIZE = 30;

export const useCookingRecordsInfiniteQuery = ({
  enabled,
  sourceTypes,
  size = DEFAULT_RECORD_LIST_SIZE,
}: {
  enabled: boolean;
  sourceTypes?: RecordSourceType[];
  size?: number;
}) => {
  const locale = useUserPagesLocale();
  return useInfiniteQuery({
    queryKey: COOKING_RECORD_QUERY_KEYS.list({ sourceTypes, size, locale }),
    queryFn: ({ pageParam }) =>
      getCookingRecords({ sourceTypes, page: pageParam, size, locale }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasNext ? lastPageParam + 1 : undefined,
    enabled,
    retry: false,
  });
};
