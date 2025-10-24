"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useScrollContext } from "@/shared/lib/ScrollContext";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { motionRef } = useScrollContext();

  const prevPathRef = useRef(pathname);

  useLayoutEffect(() => {
    const scrollContainer = motionRef.current;
    if (!scrollContainer) return;

    sessionStorage.setItem(
      `scroll_position_${prevPathRef.current}`,
      String(scrollContainer.scrollTop)
    );

    prevPathRef.current = pathname;

    const savedScrollY = sessionStorage.getItem(`scroll_position_${pathname}`);

    scrollContainer.scrollTo(0, savedScrollY ? parseInt(savedScrollY, 10) : 0);
  }, [pathname, motionRef]);

  return (
    <div
      key={pathname}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  );
};
