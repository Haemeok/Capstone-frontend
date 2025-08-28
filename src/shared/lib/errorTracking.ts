import * as Sentry from "@sentry/nextjs";

export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    tags: {
      section: "api",
      ...context?.tags,
    },
    extra: context,
  });
};

export const trackMessage = (
  message: string,
  level: "info" | "warning" | "error" = "info"
) => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: { id: string; email?: string }) => {
  Sentry.setUser(user);
};

export const addBreadcrumb = (
  message: string,
  category: string,
  level: "info" | "warning" | "error" = "info"
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now(),
  });
};

export const withErrorBoundary = Sentry.withErrorBoundary;
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
