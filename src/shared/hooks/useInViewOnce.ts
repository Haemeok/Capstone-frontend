"use client";

import { useInView } from "react-intersection-observer";

export const useInViewOnce = (options?: {
  threshold?: number;
  rootMargin?: string;
  skip?: boolean;
}) => {
  const { threshold = 0.0, rootMargin = "200px", skip = false } = options ?? {};
  const { ref, inView, entry } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
    skip,
  });

  return { ref, inView, entry };
};
