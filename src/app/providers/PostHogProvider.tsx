"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState, type ReactNode } from "react";

let isPostHogInitialized = false;

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production" &&
      !isPostHogInitialized &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "localStorage",
      });
      isPostHogInitialized = true;
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
};
