// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { triggerHaptic } from "@/shared/lib/bridge";

const LoginDialog = dynamic(() => import("@/features/auth/ui/LoginDialog"), {
  ssr: false,
});

export const GuestLoginBanner = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="bg-beige/60 flex items-center justify-between gap-3 rounded-xl px-4 py-3">
      <p className="text-ink-sub text-sm">로그인하면 계정에 저장돼요</p>
      <button
        type="button"
        onClick={() => {
          triggerHaptic("Light");
          setIsLoginOpen(true);
        }}
        className="text-olive-dark focus-visible:ring-olive-light flex min-h-11 shrink-0 cursor-pointer items-center rounded-lg px-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
      >
        로그인
      </button>
      {isLoginOpen && (
        <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      )}
    </div>
  );
};
