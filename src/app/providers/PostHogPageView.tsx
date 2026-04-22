"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { usePostHog } from "posthog-js/react";

import { shouldCapturePageview } from "./posthogPageviewGuard";

const PostHogPageViewInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;

    const search = searchParams.toString();
    const url = window.origin + pathname + (search ? `?${search}` : "");

    if (!shouldCapturePageview(url)) return;

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
};

export const PostHogPageView = () => (
  <Suspense fallback={null}>
    <PostHogPageViewInner />
  </Suspense>
);
