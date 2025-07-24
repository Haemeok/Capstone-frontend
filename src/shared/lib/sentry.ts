import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    debug: process.env.NODE_ENV === "development",

    beforeSend(event, hint) {
      if (process.env.NODE_ENV === "development") {
        console.error("Sentry Error:", event, hint);
      }

      if (event.exception) {
        const error = hint.originalException;

        if (error instanceof Error && error.name === "AbortError") {
          return null;
        }

        if (event.tags?.httpStatus === "404") {
          return null;
        }
      }

      return event;
    },

    initialScope: {
      tags: {
        component: "frontend",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
      },
    },

    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  });
};

export const conditionalInitSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    initSentry();
  } else if (process.env.NODE_ENV === "development") {
    console.warn(
      "Sentry DSN이 설정되지 않았습니다. 에러 추적이 비활성화됩니다."
    );
  }
};
