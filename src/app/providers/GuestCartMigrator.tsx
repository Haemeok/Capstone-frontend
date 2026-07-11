"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useToastStore } from "@/shared/ui/toast";

import {
  addCartItems,
  CART_MESSAGES,
  CART_QUERY_KEYS,
  useGuestCartStore,
} from "@/entities/cart";
import { useUserStore } from "@/entities/user";

export const GuestCartMigrator = () => {
  const { user, isAuthReady } = useUserStore();
  const items = useGuestCartStore((s) => s.items);
  const isHydrated = useGuestCartStore((s) => s.isHydrated);
  const hydrateFromStorage = useGuestCartStore((s) => s.hydrateFromStorage);
  const removeItems = useGuestCartStore((s) => s.removeItems);
  const queryClient = useQueryClient();
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) hydrateFromStorage();
  }, [isHydrated, hydrateFromStorage]);

  useEffect(() => {
    if (!isAuthReady || !user || !isHydrated) return;
    if (items.length === 0 || inFlightRef.current) return;

    inFlightRef.current = true;
    const count = items.length;
    // 스냅샷 id만 지운다 — 이관 중 새로 담긴 항목이 clear로 유실되지 않게
    const migratedIds = items.map((item) => item.recipeIngredientId);
    addCartItems({
      items: items.map(({ recipeIngredientId, quantity, unit }) => ({
        recipeIngredientId,
        quantity,
        unit,
      })),
    })
      .then(() => {
        removeItems(migratedIds);
        useToastStore.getState().addToast({
          message: CART_MESSAGES.migrated(count),
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      })
      .catch(() => {
        // 로컬 보존 — 다음 마운트/로그인에서 재시도
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }, [isAuthReady, user, isHydrated, items, removeItems, queryClient]);

  return null;
};
