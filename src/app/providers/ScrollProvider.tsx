"use client";

import { type ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";

import { shouldHideNavbar } from "@/shared/lib/navigation";
import { ScrollContext } from "@/shared/lib/ScrollContext";

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const paddingClass = shouldHideNavbar(pathname) ? "" : "pb-[77px]";

  return (
    <ScrollContext.Provider value={{ motionRef }}>
      <div
        ref={motionRef}
        className={`h-[100dvh] w-full overflow-y-auto ${paddingClass}`}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};
