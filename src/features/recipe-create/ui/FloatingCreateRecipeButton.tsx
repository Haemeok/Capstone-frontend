"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useScrollContext } from "@/shared/lib/ScrollContext";

const COLLAPSE_RATIO = 0.2;
const COLLAPSED_WIDTH = 56;
const COLLAPSED_PADDING = 18;
const EXPANDED_PADDING_LEFT = 16;
const EXPANDED_PADDING_RIGHT = 20;

const MotionLink = motion.create(Link);

const FloatingCreateRecipeButton = () => {
  const { motionRef } = useScrollContext();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ghost = ghostRef.current;
    if (!ghost) return;
    setExpandedWidth(ghost.offsetWidth);
    const observer = new ResizeObserver(() => {
      setExpandedWidth(ghost.offsetWidth);
    });
    observer.observe(ghost);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = motionRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let threshold = el.clientHeight * COLLAPSE_RATIO;

    const updateCollapsed = () => {
      rafId = null;
      setCollapsed(el.scrollTop > threshold);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateCollapsed);
    };

    const onResize = () => {
      threshold = el.clientHeight * COLLAPSE_RATIO;
      onScroll();
    };

    updateCollapsed();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [motionRef]);

  return (
    <>
      <div
        ref={ghostRef}
        aria-hidden
        className="md:hidden pointer-events-none fixed left-0 top-0 flex h-14 items-center whitespace-nowrap pl-4 pr-5 font-bold opacity-0"
      >
        <Plus size={20} />
        <span className="ml-1">레시피</span>
      </div>
      <MotionLink
        href="/recipes/new"
        prefetch={false}
        aria-label="레시피 등록하기"
        onClick={() => triggerHaptic("Light")}
        className="md:hidden z-header sticky-optimized fixed bottom-24 right-5 flex h-14 items-center justify-center overflow-hidden rounded-full bg-olive-light font-bold text-white shadow-lg active:scale-[0.98] transition-transform duration-150"
        initial={false}
        animate={{
          width: collapsed ? COLLAPSED_WIDTH : (expandedWidth ?? "auto"),
          paddingLeft: collapsed ? COLLAPSED_PADDING : EXPANDED_PADDING_LEFT,
          paddingRight: collapsed ? COLLAPSED_PADDING : EXPANDED_PADDING_RIGHT,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      >
        <Plus size={20} className="shrink-0" />
        <motion.span
          className="shrink-0 whitespace-nowrap overflow-hidden"
          animate={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
            marginLeft: collapsed ? 0 : 4,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          레시피
        </motion.span>
      </MotionLink>
    </>
  );
};

export default FloatingCreateRecipeButton;
