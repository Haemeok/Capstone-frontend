"use client";

import Link from "next/link";

import { useUserStore } from "@/entities/user";

const CTA_CLASS_NAME =
  "bg-olive-light active:bg-olive-dark flex min-h-12 w-full items-center justify-center rounded-xl text-base font-bold text-white";

export const CookingRecordEventCta = () => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isAuthReady = useUserStore((state) => state.isAuthReady);

  if (!isAuthReady) {
    return (
      <button type="button" disabled className={`${CTA_CLASS_NAME} opacity-50`}>
        내 요리기록 보러 가기
      </button>
    );
  }

  const recordHref = `/users/${user?.id ?? "guestUser"}?tab=calendar`;
  const href =
    isAuthenticated && user
      ? recordHref
      : `/login?${new URLSearchParams({ redirectUrl: recordHref }).toString()}`;

  return (
    <Link href={href} className={CTA_CLASS_NAME}>
      내 요리기록 보러 가기
    </Link>
  );
};
