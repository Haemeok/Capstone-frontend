"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollContext } from "@/shared/lib/ScrollContext";
import { shouldHideNavbar } from "@/shared/lib/navigation";

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const paddingClass = shouldHideNavbar(pathname) ? "" : "pb-[70px]";

  return (
    <ScrollContext.Provider value={{ motionRef }}>
      <div
        ref={motionRef}
        className={`h-screen w-screen overflow-y-auto ${paddingClass}`}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};
