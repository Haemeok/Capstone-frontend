"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { markInternalNav } from "@/shared/lib/entryContext";

export const InternalNavTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    markInternalNav(pathname);
  }, [pathname]);

  return null;
};
