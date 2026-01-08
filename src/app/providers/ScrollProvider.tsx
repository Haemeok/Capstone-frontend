"use client";

import { type ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";

import { shouldHideNavbar } from "@/shared/lib/navigation";
import { ScrollContext } from "@/shared/lib/ScrollContext";

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollClass = shouldHideNavbar(pathname)
    ? "h-[100dvh] md:h-[calc(100dvh-64px)] md:mt-16"
    : "h-[100dvh] md:h-[calc(100dvh-64px)] md:mt-16";

  return (
    <ScrollContext.Provider value={{ motionRef }}>
      <div
        ref={motionRef}
        className={`w-full flex flex-col overflow-y-auto ${scrollClass}`}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};
