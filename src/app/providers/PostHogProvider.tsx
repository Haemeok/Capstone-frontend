"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type { PostHog } from "posthog-js";

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

    const initPostHog = async () => {
      const { default: posthog } = await import("posthog-js");
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "localStorage",
        disable_session_recording: true,
        autocapture: false,
        capture_dead_clicks: false,
      });
      isPostHogInitialized = true;
      setClient(posthog);
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => initPostHog(), { timeout: 3000 });
    } else {
      setTimeout(() => initPostHog(), 2000);
    }
  }, []);

  return (
    <PostHogClientContext.Provider value={client}>
      {children}
    </PostHogClientContext.Provider>
  );
};
