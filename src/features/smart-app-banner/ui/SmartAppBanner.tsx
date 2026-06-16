"use client";

import { AnimatePresence, motion } from "motion/react";

import { useSmartAppBanner } from "../model/useSmartAppBanner";
import { SmartAppBannerCard } from "./SmartAppBannerCard";

export const SmartAppBanner = () => {
  const { isVisible, dismiss } = useSmartAppBanner();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="z-toast sticky-optimized fixed right-0 bottom-[var(--bottom-nav-h)] left-0 md:hidden"
        >
          <SmartAppBannerCard onDismiss={dismiss} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
