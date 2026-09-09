"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { PostHog } from "posthog-js";

import { isPrivateReportDocument } from "@/shared/config/privateRoutes";
import { registerAnalyticsClient } from "@/shared/lib/analytics";

const PostHogClientContext = createContext<PostHog | null>(null);

export const usePostHogClient = () => useContext(PostHogClientContext);

let isPostHogInitialized = false;

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production" ||
      isPostHogInitialized ||
      !process.env.NEXT_PUBLIC_POSTHOG_KEY
    ) {
      return;
    }

    let cancelled = false;
    const initPostHog = async () => {
      if (cancelled || isPrivateReportDocument()) return;
      const { default: posthog } = await import("posthog-js");
      if (cancelled || isPrivateReportDocument()) return;
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "localStorage",
        disable_session_recording: true,
        autocapture: false,
        capture_dead_clicks: false,
        before_send: (event) => (isPrivateReportDocument() ? null : event),
      });
      registerAnalyticsClient(posthog);
      isPostHogInitialized = true;
      setClient(posthog);
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => initPostHog(), { timeout: 3000 });
    } else {
      setTimeout(() => initPostHog(), 2000);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PostHogClientContext.Provider value={client}>
      {children}
    </PostHogClientContext.Provider>
  );
};
