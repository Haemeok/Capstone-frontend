"use client";

import { usePathname } from "next/navigation";

import { shouldHideNavbar } from "@/shared/lib/navigation";

import { useIsApp } from "./useIsApp";

export const useIsBottomNavVisible = (): boolean => {
  const pathname = usePathname();
  const isApp = useIsApp();
  return !shouldHideNavbar(pathname, { isApp });
};
