"use client";

import { useFilterParam, dishTypeCodec } from "@/shared/lib/filters";

export const useDishTypeFilter = () => {
  return useFilterParam("dishType", dishTypeCodec);
};

export const useDishTypeCode = () => {
  const [dishType] = useDishTypeFilter();
  return dishTypeCodec.encode(dishType);
};
