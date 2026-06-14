"use client";

import { useErrorsDict } from "@/shared/i18n";

type ErrorContext = "recipe" | "search" | "ingredients" | "edit" | "generic";

type ErrorFallbackProps = {
  reset: () => void;
  context?: ErrorContext;
  message?: string;
};

const ErrorFallback = ({
  reset,
  context = "generic",
  message,
}: ErrorFallbackProps) => {
  const t = useErrorsDict();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <p className="text-ink text-lg font-bold">{t.heading}</p>
      <p className="text-ink-muted text-sm">{message ?? t.context[context]}</p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="bg-olive-light hover:bg-olive-dark h-12 rounded-xl px-6 font-medium text-white transition-colors"
        >
          {t.retry}
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="text-ink-sub h-12 rounded-xl bg-gray-100 px-6 font-medium transition-colors hover:bg-gray-200"
        >
          {t.goHome}
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
