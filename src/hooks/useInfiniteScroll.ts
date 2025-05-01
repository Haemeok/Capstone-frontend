import { useEffect, useRef } from 'react';
import {
  useInfiniteQuery,
  InfiniteData,
  QueryKey,
  DefaultError,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import throttle from 'lodash.throttle';

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
    allPageParams: TPageParam[],
  ) => TPageParam | undefined | null;

  initialPageParam: TPageParam;
  threshold?: number;
  throttleMs?: number;
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

  const throttledFetchNextPage = useRef(
    throttle(() => {
      fetchNextPage();
    }, throttleMs),
  ).current;

  useEffect(() => {
    return () => {
      throttledFetchNextPage.cancel();
    };
  }, [throttledFetchNextPage]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      throttledFetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, throttledFetchNextPage]);

  return {
    ref,
    data,
    error,
    fetchNextPage: throttledFetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isPending,
    result: queryResult,
    refetch,
  };
};
