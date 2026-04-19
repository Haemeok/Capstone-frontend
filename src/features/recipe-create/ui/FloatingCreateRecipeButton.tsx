"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

const COLLAPSE_RATIO = 0.5;

const FloatingCreateRecipeButton = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let threshold = window.innerHeight * COLLAPSE_RATIO;

    const updateCollapsed = () => {
      rafId = null;
      setCollapsed(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateCollapsed);
    };

    const onResize = () => {
      threshold = window.innerHeight * COLLAPSE_RATIO;
      onScroll();
    };

    updateCollapsed();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <motion.div
      className="md:hidden z-header sticky-optimized fixed bottom-24 right-5"
      animate={{ width: collapsed ? 56 : "auto" }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <Link
        href="/recipes/new"
        prefetch={false}
        aria-label="레시피 등록하기"
        onClick={() => triggerHaptic("Light")}
        className="flex h-14 w-full items-center justify-center gap-1 overflow-hidden rounded-full bg-olive-light font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
      >
        <Plus size={20} className="shrink-0" />
        <motion.span
          className="shrink-0 whitespace-nowrap overflow-hidden"
          animate={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
            marginLeft: collapsed ? 0 : 0,
            marginRight: collapsed ? 0 : 4,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          레시피
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default FloatingCreateRecipeButton;
