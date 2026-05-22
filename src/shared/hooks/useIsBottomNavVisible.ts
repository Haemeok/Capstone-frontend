"use client";

import { usePathname } from "next/navigation";

import { shouldHideNavbar } from "@/shared/lib/navigation";

import { useAIRecipeFocusStore } from "@/features/recipe-create-ai/model/focusStore";

import { useIsApp } from "./useIsApp";

export const useIsBottomNavVisible = (): boolean => {
  const pathname = usePathname();
  const isApp = useIsApp();
  const focusFormPage = useAIRecipeFocusStore((s) => s.focusFormPage);
  return !shouldHideNavbar(pathname, { isApp }) && !focusFormPage;
};
