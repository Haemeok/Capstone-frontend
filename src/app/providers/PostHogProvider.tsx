"use client";

import { type ReactNode,useEffect, useState } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

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
      const initPostHog = () => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
          ui_host: "https://us.posthog.com",
          capture_pageview: false,
          capture_pageleave: true,
          persistence: "localStorage",
          disable_session_recording: true,
          autocapture: false,
          capture_dead_clicks: false,
          loaded: (ph) => {
            ph.capture("$pageview", { $current_url: window.location.href });
          },
        });
        isPostHogInitialized = true;
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(initPostHog, { timeout: 3000 });
      } else {
        setTimeout(initPostHog, 2000);
      }
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
};
