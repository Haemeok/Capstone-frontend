import { useQuery } from "@tanstack/react-query";

import { getCart } from "@/entities/cart/api";

import { CART_QUERY_KEYS } from "../queryKeys";

type Options = { enabled: boolean };

// 같은 queryKey라 useCart와 캐시 공유(추가 GET 없음), select로 개수만 구독
export const useCartItemCount = ({ enabled }: Options): number => {
  const { data } = useQuery({
    queryKey: CART_QUERY_KEYS.all,
    queryFn: getCart,
    enabled,
    select: (cart) => cart.totalItemCount,
  });
  return data ?? 0;
};
