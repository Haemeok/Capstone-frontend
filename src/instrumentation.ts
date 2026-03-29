export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initSentryServer } = await import("@/shared/lib/sentry/server");
    initSentryServer();
  }
};
