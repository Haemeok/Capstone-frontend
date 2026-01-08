"use client";

import { useEffect, type ReactNode } from "react";

import { useScrollContext } from "@/shared/lib/ScrollContext";

export const ScrollReset = ({ children }: { children: ReactNode }) => {
  const { motionRef } = useScrollContext();

  useEffect(() => {
    if (motionRef.current) {
      motionRef.current.scrollTo(0, 0);
    }
  }, [motionRef]);

  return <>{children}</>;
};
