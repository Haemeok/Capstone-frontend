"use client";

import { motion } from "motion/react";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";

const cardVariants = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};
const cardTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const DuplicateRecipeSkeleton = () => (
  <motion.div
    key="duplicate-skeleton"
    variants={cardVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={cardTransition}
    className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg"
  >
    <Skeleton className="mx-auto h-16 w-16 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="mx-auto h-6 w-3/4" />
      <Skeleton className="mx-auto h-4 w-1/2" />
    </div>
    <Skeleton className="mx-auto h-[180px] w-[180px] rounded-2xl" />
    <Skeleton className="h-14 w-full rounded-2xl" />
  </motion.div>
);
