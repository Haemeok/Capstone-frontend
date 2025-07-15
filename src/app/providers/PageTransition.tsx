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

    // 이전 페이지의 스크롤 위치 저장
    sessionStorage.setItem(
      `scroll_position_${prevPathRef.current}`,
      String(scrollContainer.scrollTop)
    );

    // 다음 페이지로 이동하기 전, 현재 경로를 '이전 경로'로 업데이트
    prevPathRef.current = pathname;

    // 새로 이동한 페이지의 저장된 스크롤 위치 가져오기
    const savedScrollY = sessionStorage.getItem(`scroll_position_${pathname}`);

    // 저장된 위치로 스크롤 이동
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
