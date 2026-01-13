"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

import useScrollAnimate from "@/shared/hooks/useScrollAnimate";
import { Button } from "@/shared/ui/shadcn/button";
import { cn } from "@/shared/lib/utils";

type ExpandableFabButtonItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  prefetch?: boolean;
};

type ExpandableFabButtonProps = {
  icon: React.ReactNode;
  ariaLabel: string;
  items: ExpandableFabButtonItem[];
  animated?: boolean;
  triggerRef?: React.RefObject<HTMLDivElement | null>;
};

export const ExpandableFabButton = ({
  icon,
  ariaLabel,
  items,
  animated = true,
  triggerRef,
}: ExpandableFabButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { targetRef } = useScrollAnimate<HTMLDivElement>({
    triggerRef: animated ? triggerRef : undefined,
    start: "top bottom-=100px",
    toggleActions: "play none none reset",
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleMenuItemClick = () => {
    setIsExpanded(false);
  };

  const handleBackdropClick = () => {
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Invisible backdrop for click-outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[19]"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <div
        className="z-header sticky-optimized fixed bottom-24"
        ref={targetRef}
        style={{
          opacity: 0,
          right: "max(1.5rem, calc((100vw - 896px) / 2 - 5rem))",
        }}
      >
        {/* Menu container */}
        <nav
          className="relative flex flex-col items-end gap-3"
          onKeyDown={handleKeyDown}
        >
          {/* Menu items - rendered above main button */}
          <AnimatePresence>
            {isExpanded &&
              items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <Link
                    href={item.href}
                    prefetch={item.prefetch ?? false}
                    onClick={handleMenuItemClick}
                  >
                    <Button
                      className={cn(
                        "border-olive-light text-olive-light h-12 cursor-pointer gap-2 rounded-full border-2 bg-white px-4 py-2 shadow-xl",
                        "hover:bg-olive-light/10 transition-colors"
                      )}
                    >
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>

          <button
            onClick={handleToggle}
            className={cn(
              "bg-olive-light h-14 w-14 cursor-pointer rounded-full text-white shadow-2xl",
              "hover:bg-olive-light/90 transition-colors",
              "flex items-center justify-center"
            )}
            aria-label={ariaLabel}
            aria-expanded={isExpanded}
          >
            {icon}
          </button>
        </nav>
      </div>
    </>
  );
};
