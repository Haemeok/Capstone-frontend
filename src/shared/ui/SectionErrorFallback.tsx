"use client";

import { useErrorsDict } from "@/shared/i18n/useErrorsDict";

type SectionErrorFallbackProps = {
  message?: string;
  onRetry?: () => void;
};

const SectionErrorFallback = ({
  message,
  onRetry,
}: SectionErrorFallbackProps) => {
  const t = useErrorsDict();
  return (
    <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6">
      <p className="text-ink-muted text-sm">{message ?? t.sectionMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-ink-sub ml-3 text-sm font-medium underline"
        >
          {t.sectionRetry}
        </button>
      )}
    </div>
  );
};

export default SectionErrorFallback;
