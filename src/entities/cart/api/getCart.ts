import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

import type { CartGroup, CartItem, CartResponse } from "./types";

type RawCartItem = Omit<CartItem, "quantity" | "unit"> & {
  quantity: string | null;
  unit: string | null;
};

type RawCartGroup = Omit<CartGroup, "items"> & { items: RawCartItem[] };

type RawCartResponse = Omit<CartResponse, "groups" | "unmatchedItems"> & {
  groups: RawCartGroup[];
  unmatchedItems: RawCartItem[];
};

// 수량·단위 없이 담긴 항목은 서버가 null을 내려줌 → UI 불변식(문자열)으로 정규화
const normalizeItem = (item: RawCartItem): CartItem => ({
  ...item,
  quantity: item.quantity ?? "",
  unit: item.unit ?? "",
});

export const getCart = async (lang: Locale): Promise<CartResponse> => {
  const raw = await api.get<RawCartResponse>(
    `${END_POINTS.MY_CART}?lang=${lang}`
  );
  return {
    ...raw,
    groups: raw.groups.map((group) => ({
      ...group,
      items: group.items.map(normalizeItem),
    })),
    unmatchedItems: raw.unmatchedItems.map(normalizeItem),
  };
};
