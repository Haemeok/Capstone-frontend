"use client";

import { sortCodec,useFilterParam } from "@/shared/lib/filters";

export const useSortFilter = () => {
  return useFilterParam("sort", sortCodec);
};

export const useSortCode = () => {
  const [sort] = useSortFilter();
  return sortCodec.encode(sort);
};
