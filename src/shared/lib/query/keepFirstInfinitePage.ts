import type { InfiniteData } from "@tanstack/react-query";

export const keepFirstInfinitePage = <TData, TPageParam>(
  data: InfiniteData<TData, TPageParam> | undefined
): InfiniteData<TData, TPageParam> | undefined => {
  if (data === undefined) {
    return undefined;
  }

  return {
    pages: data.pages.slice(0, 1),
    pageParams: data.pageParams.slice(0, 1),
  };
};
