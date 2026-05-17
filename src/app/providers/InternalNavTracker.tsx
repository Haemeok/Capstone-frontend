"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  INTERNAL_NAV_KEY,
  LAST_PATH_KEY,
} from "@/shared/hooks/useIsExternalEntry";

export const InternalNavTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const lastPath = sessionStorage.getItem(LAST_PATH_KEY);

    if (lastPath === null) {
      sessionStorage.setItem(LAST_PATH_KEY, pathname);
      return;
    }
    if (lastPath === pathname) return;
    sessionStorage.setItem(LAST_PATH_KEY, pathname);
    sessionStorage.setItem(INTERNAL_NAV_KEY, "1");
  }, [pathname]);

  return null;
};
