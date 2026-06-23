"use client";

import { useEffect } from "react";

import { appGlobalMessages, resolveChromeLocale } from "@/shared/i18n";
import { captureException, scheduleInit } from "@/shared/lib/sentry";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    scheduleInit();
    captureException(error);
  }, [error]);

  const locale =
    typeof window !== "undefined"
      ? resolveChromeLocale(window.location.pathname)
      : "ko";
  const t = appGlobalMessages[locale];

  return (
    <html lang={locale}>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="flex max-w-md flex-col items-center gap-6 text-center">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-ink text-2xl font-bold">{t.error.title}</h1>
            <p className="text-ink-sub">{t.error.description}</p>
            <div className="flex gap-3">
              <button
                onClick={() => reset()}
                className="text-ink-sub rounded-lg bg-gray-100 px-6 py-3 font-medium transition-colors hover:bg-gray-200"
              >
                {t.error.retry}
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-olive-light hover:bg-olive-dark rounded-lg px-6 py-3 font-medium text-white transition-colors"
              >
                {t.error.goHome}
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
