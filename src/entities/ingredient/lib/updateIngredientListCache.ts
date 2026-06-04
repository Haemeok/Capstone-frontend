import { InfiniteData } from "@tanstack/react-query";

import {
  IngredientItem,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";

type InfiniteList = InfiniteData<IngredientsApiResponse>;

const mapBrowseItems =
  (mapItem: (item: IngredientItem) => IngredientItem) =>
  (oldData: InfiniteList | undefined): InfiniteList | undefined => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        content: page.content.map(mapItem),
      })),
    };
  };

export const setInFridgeForIds = (ids: Set<string>, value: boolean) =>
  mapBrowseItems((item) =>
    ids.has(item.id) ? { ...item, inFridge: value } : item
  );

export const removeIdsFromFridge =
  (ids: Set<string>) =>
  (oldData: InfiniteList | undefined): InfiniteList | undefined => {
    if (!oldData) return oldData;
    let removed = 0;
    const pages = oldData.pages.map((page) => ({
      ...page,
      content: page.content.filter((item) => {
        const drop = ids.has(item.id);
        if (drop) removed += 1;
        return !drop;
      }),
    }));
    const prevTotal = oldData.pages[0]?.page.totalElements ?? 0;
    const size = oldData.pages[0]?.page.size ?? 10;
    const totalElements = Math.max(0, prevTotal - removed);
    const totalPages = Math.ceil(totalElements / size);
    return {
      ...oldData,
      pages: pages.map((page) => ({
        ...page,
        page: { ...page.page, totalElements, totalPages },
      })),
    };
  };
