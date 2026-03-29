import { isIgnoredError } from "./filters";

const initSentryServer = () => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
  if (!dsn) return;

  import("@sentry/node").then((Sentry) => {
    Sentry.init({
      dsn,
      sampleRate: 1.0,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
      beforeSend(event) {
        if (isIgnoredError(event)) return null;
        return event;
      },
    });
  }).catch((e) => {
    console.error("[Sentry] Server init failed:", e);
  });
};

export { initSentryServer };
