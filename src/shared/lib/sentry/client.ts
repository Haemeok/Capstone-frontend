import { beforeSend } from "./filters";
import type { SentryUser } from "./types";

type SentryModule = typeof import("@sentry/browser");

let sentryModule: SentryModule | null = null;
let isInitialized = false;

const errorQueue: Array<{ error: unknown; tags?: Record<string, string> }> = [];
const pendingUserUpdate: { current: SentryUser | null } = { current: null };

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";

const flushErrorQueue = () => {
  if (!sentryModule) return;

  while (errorQueue.length > 0) {
    const item = errorQueue.shift();
    if (!item) continue;

    sentryModule.withScope((scope) => {
      if (item.tags) {
        Object.entries(item.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      sentryModule!.captureException(item.error);
    });
  }
};

const initSentry = async () => {
  if (isInitialized || !SENTRY_DSN) return;

  try {
    const Sentry = await import("@sentry/browser");
    sentryModule = Sentry;

    Sentry.init({
      dsn: SENTRY_DSN,
      sampleRate: 1.0,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
      beforeSend: beforeSend as any,
      defaultIntegrations: false,
      integrations: [
        Sentry.breadcrumbsIntegration(),
        Sentry.dedupeIntegration(),
        Sentry.globalHandlersIntegration(),
        Sentry.linkedErrorsIntegration(),
      ],
    });

    if (pendingUserUpdate.current) {
      Sentry.setUser(pendingUserUpdate.current);
    }

    isInitialized = true;
    flushErrorQueue();
  } catch (e) {
    console.error("[Sentry] Failed to initialize:", e);
  }
};

const scheduleInit = () => {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => initSentry());
  } else {
    setTimeout(() => initSentry(), 2000);
  }
};

const captureException = (
  error: unknown,
  tags?: Record<string, string>
) => {
  if (!sentryModule) {
    errorQueue.push({ error, tags });
    return;
  }

  sentryModule.withScope((scope) => {
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    sentryModule!.captureException(error);
  });
};

const setUser = (user: SentryUser | null) => {
  pendingUserUpdate.current = user;

  if (sentryModule) {
    sentryModule.setUser(user);
  }
};

export { scheduleInit, captureException, setUser };
