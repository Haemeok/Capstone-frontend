"use client";

import type { ReactNode } from "react";

import { useIsApp } from "@/shared/hooks/useIsApp";

type WebOnlyAdSlotProps = {
  children: ReactNode;
};

export const WebOnlyAdSlot = ({ children }: WebOnlyAdSlotProps) => {
  const isApp = useIsApp();

  if (isApp) return null;

  return <>{children}</>;
};
