"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import {
  DefaultError,
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import throttle from "lodash.throttle";

type UseInfiniteScrollOptions<
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
> = {
  queryKey: TQueryKey;

  queryFn: ({ pageParam }: { pageParam: TPageParam }) => Promise<TQueryFnData>;

  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
    lastPageParam: TPageParam,
    allPageParams: TPageParam[]
  ) => TPageParam | undefined | null;

  initialPageParam: TPageParam;
  threshold?: number;
  throttleMs?: number;
  initialData?: InfiniteData<TQueryFnData, TPageParam>;
  enabled?: boolean;
};

export const useInfiniteScroll = <
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
>({
  queryKey,
  queryFn,
  getNextPageParam,
  initialPageParam,
  threshold = 0.5,
  throttleMs = 300,
  initialData,
  enabled,
}: UseInfiniteScrollOptions<TQueryFnData, TQueryKey, TPageParam>) => {
  const queryResult = useInfiniteQuery<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      queryFn({ pageParam } as { pageParam: TPageParam }),
    getNextPageParam,
    initialPageParam,
    initialData,
    enabled,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isPending,
    refetch,
  } = queryResult;

  const { ref, inView } = useInView({ threshold });

  const fetchNextPageRef = useRef(fetchNextPage);
  const throttledFetchNextPageRef = useRef<ReturnType<typeof throttle> | null>(
    null
  );

  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage;
  }, [fetchNextPage]);

  useEffect(() => {
    const throttled = throttle(() => {
      fetchNextPageRef.current();
    }, throttleMs);
    throttledFetchNextPageRef.current = throttled;
    return () => {
      throttled.cancel();
      throttledFetchNextPageRef.current = null;
    };
  }, [throttleMs]);

  const triggerFetchNextPage = useCallback(() => {
    throttledFetchNextPageRef.current?.();
  }, []);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      throttledFetchNextPageRef.current?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return {
    ref,
    data,
    error,
    fetchNextPage: triggerFetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isPending,
    result: queryResult,
    refetch,
  };
};
