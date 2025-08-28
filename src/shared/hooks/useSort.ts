import { useMemo,useState } from "react";

import {
  type CommentSortType,
  type RecipeSortType,
  SORT_CONFIGS,
  type SortConfig,
} from "@/shared/config/constants/recipe";

type SortType = "comment" | "recipe";

type SortOptions<T extends SortType> = T extends "comment"
  ? CommentSortType
  : RecipeSortType;

export type UseSortReturn<T extends SortType> = {
  currentSort: SortOptions<T>;
  setSort: (sort: SortOptions<T>) => void;
  getSortParam: () => string;
  availableSorts: readonly SortOptions<T>[];
};

export const useSort = <T extends SortType>(
  type: T,
  initialSort?: SortOptions<T>
): UseSortReturn<T> => {
  const configs = SORT_CONFIGS[type];

  const availableSorts = Object.keys(configs) as readonly SortOptions<T>[];

  const defaultSort = initialSort || availableSorts[0];
  const [currentSort, setCurrentSort] = useState<SortOptions<T>>(defaultSort);

  const setSort = (sort: SortOptions<T>) => {
    setCurrentSort(sort);
  };

  const getSortParam = (): string => {
    const config = configs[currentSort as keyof typeof configs] as SortConfig;
    return `${config.field},${config.direction.toLowerCase()}`;
  };

  return {
    currentSort,
    setSort,
    getSortParam,
    availableSorts,
  };
};
