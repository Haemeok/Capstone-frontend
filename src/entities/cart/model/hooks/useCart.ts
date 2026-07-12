import { useQuery } from "@tanstack/react-query";

import { useApiLocale } from "@/shared/i18n";

import { getCart } from "@/entities/cart/api";

import { CART_QUERY_KEYS } from "../queryKeys";

type Options = { enabled: boolean };

// entities/user를 import하지 않는다(FSD) — 로그인 여부는 호출자가 enabled로 전달
export const useCart = ({ enabled }: Options) => {
  const lang = useApiLocale();
  return useQuery({
    queryKey: CART_QUERY_KEYS.byLang(lang),
    queryFn: () => getCart(lang),
    enabled,
  });
};
