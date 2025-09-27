"use client";

import { useInView } from "react-intersection-observer";

export const useInViewOnce = (options?: {
  threshold?: number;
  rootMargin?: string;
}) => {
  const { threshold = 0.0, rootMargin = "200px" } = options ?? {};
  const { ref, inView, entry } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  return { ref, inView, entry };
};
