"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import { hasInternalNav, isEntryPath } from "@/shared/lib/entryContext";

const emptySubscribe = () => () => {};

const isExternalReferrer = () => {
  const referrer = document.referrer;
  if (!referrer) return true;
  try {
    return new URL(referrer).origin !== window.location.origin;
  } catch {
    return true;
  }
};

export const useIsExternalEntry = (): boolean => {
  const pathname = usePathname();

  return useSyncExternalStore(
    emptySubscribe,
    () => isEntryPath(pathname) && !hasInternalNav() && isExternalReferrer(),
    () => false
  );
};
