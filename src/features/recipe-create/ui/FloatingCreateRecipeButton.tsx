"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useRecipeFormDict } from "@/shared/i18n";
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
  const { ui } = useRecipeFormDict();
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

  useLayoutEffect(() => {
    const el = motionRef.current;
    if (!el) return;
    setCollapsed(el.scrollTop > el.clientHeight * COLLAPSE_RATIO);
  }, [motionRef]);

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
        className="pointer-events-none fixed top-0 left-0 flex h-14 items-center pr-5 pl-4 font-bold whitespace-nowrap opacity-0 md:hidden"
      >
        <Plus size={20} />
        <span className="ml-1">{ui.floatingCreateText}</span>
      </div>
      {expandedWidth !== null && (
        <MotionLink
          href="/recipes/new"
          prefetch={false}
          aria-label={ui.floatingCreateLabel}
          onClick={() => triggerHaptic("Light")}
          className="z-header sticky-optimized bg-olive-light fixed right-5 bottom-24 flex h-14 items-center justify-center overflow-hidden rounded-full font-bold text-white shadow-lg transition-transform duration-150 active:scale-[0.98] md:hidden"
          initial={false}
          animate={{
            width: collapsed ? COLLAPSED_WIDTH : expandedWidth,
            paddingLeft: collapsed ? COLLAPSED_PADDING : EXPANDED_PADDING_LEFT,
            paddingRight: collapsed
              ? COLLAPSED_PADDING
              : EXPANDED_PADDING_RIGHT,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <Plus size={20} className="shrink-0" />
          <motion.span
            className="shrink-0 overflow-hidden whitespace-nowrap"
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              marginLeft: collapsed ? 0 : 4,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {ui.floatingCreateText}
          </motion.span>
        </MotionLink>
      )}
    </>
  );
};

export default FloatingCreateRecipeButton;
