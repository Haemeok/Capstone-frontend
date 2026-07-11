"use client";

import { useCartItemCount, useGuestCartStore } from "@/entities/cart";
import { useUserStore } from "@/entities/user";

type CartCountBadgeProps = { children: React.ReactNode };

export const CartCountBadge = ({ children }: CartCountBadgeProps) => {
  const { user, isAuthReady } = useUserStore();
  const serverCount = useCartItemCount({ enabled: isAuthReady && !!user });
  const guestCount = useGuestCartStore((s) => s.items.length);
  const count = user ? serverCount : guestCount;

  return (
    <div className="relative">
      {children}
      {count > 0 && (
        <span
          aria-hidden="true"
          data-testid="cart-count-badge"
          className="bg-olive-light absolute -top-1 left-1/2 flex h-[18px] min-w-[18px] translate-x-1 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};
