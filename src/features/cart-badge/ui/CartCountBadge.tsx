"use client";

import { cn } from "@/shared/lib/utils";

import { useCartItemCount, useGuestCartStore } from "@/entities/cart";
import { useUserStore } from "@/entities/user";

const BADGE_POSITION = {
  nav: "-top-1 left-1/2 translate-x-1",
  header: "-top-1.5 -right-1.5",
} as const;

type CartCountBadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof BADGE_POSITION;
};

export const CartCountBadge = ({
  children,
  variant = "nav",
}: CartCountBadgeProps) => {
  const { user, isAuthReady } = useUserStore();
  const serverCount = useCartItemCount({ enabled: isAuthReady && !!user });
  const guestCount = useGuestCartStore((s) => s.items.length);
  const count = user ? serverCount : guestCount;

  return (
    // header: 인라인 링크가 만드는 라인박스 여백 없이 아이콘 크기에 딱 맞게
    <div className={cn("relative", variant === "header" && "flex")}>
      {children}
      {count > 0 && (
        <span
          aria-hidden="true"
          data-testid="cart-count-badge"
          className={cn(
            "bg-olive-light absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white",
            BADGE_POSITION[variant]
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};
