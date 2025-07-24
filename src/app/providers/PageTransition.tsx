"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { useScrollContext } from "@/shared/lib/ScrollContext";

const pageVariants = {
  initial: {
    opacity: 0.7,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeIn",
  duration: 0.25,
} as const;

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
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
