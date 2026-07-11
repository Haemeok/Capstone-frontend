import { useCallback, useEffect, useMemo } from "react";

import { useQueries, type UseQueryResult } from "@tanstack/react-query";

import { ApiError } from "@/shared/api/errors";
import {
  type CoupangRecipeItem,
  getRecipeCoupangProducts,
  type RecipeCoupangProductsResponse,
} from "@/shared/coupang";

import type { CartResponse } from "../../api/types";
import { buildGuestCartView } from "../buildGuestCartView";
import { useGuestCartStore } from "../guestCartStore";

type Options = { enabled: boolean };

type GuestCartViewResult = {
  cart: CartResponse | undefined;
  isPending: boolean;
};

type CombinedCoupang = {
  isPending: boolean;
  byIngredientId: Map<string, CoupangRecipeItem>;
  deletedRecipeIds: Set<string>;
};

export const useGuestCartView = ({ enabled }: Options): GuestCartViewResult => {
  const items = useGuestCartStore((s) => s.items);
  const isHydrated = useGuestCartStore((s) => s.isHydrated);
  const hydrateFromStorage = useGuestCartStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    if (enabled && !isHydrated) hydrateFromStorage();
  }, [enabled, isHydrated, hydrateFromStorage]);

  const recipeIds = useMemo(
    () => [...new Set(items.map((item) => item.recipe.recipeId))],
    [items]
  );

  const combine = useCallback(
    (
      results: UseQueryResult<RecipeCoupangProductsResponse, Error>[]
    ): CombinedCoupang => {
      const byIngredientId = new Map<string, CoupangRecipeItem>();
      const deletedRecipeIds = new Set<string>();
      results.forEach((result, index) => {
        result.data?.items.forEach((coupangItem) => {
          byIngredientId.set(coupangItem.recipeIngredientId, coupangItem);
        });
        // 404 = 삭제된 레시피. 그 외 에러는 매칭 없음으로만 처리해 페이지는 뜬다
        if (ApiError.isNotFound(result.error)) {
          deletedRecipeIds.add(recipeIds[index]);
        }
      });
      return {
        isPending: results.some(
          (result) => result.isPending && result.fetchStatus !== "idle"
        ),
        byIngredientId,
        deletedRecipeIds,
      };
    },
    [recipeIds]
  );

  const combined = useQueries({
    queries: recipeIds.map((recipeId) => ({
      queryKey: ["recipe-coupang-products", recipeId] as const,
      queryFn: () => getRecipeCoupangProducts(recipeId),
      enabled,
      retry: false,
      staleTime: 5 * 60 * 1000,
    })),
    combine,
  });

  const isPending = enabled && (!isHydrated || combined.isPending);

  const cart = useMemo(() => {
    if (!enabled || isPending) return undefined;
    return buildGuestCartView(items, {
      byIngredientId: combined.byIngredientId,
      deletedRecipeIds: combined.deletedRecipeIds,
    });
  }, [
    enabled,
    isPending,
    items,
    combined.byIngredientId,
    combined.deletedRecipeIds,
  ]);

  return { cart, isPending };
};
