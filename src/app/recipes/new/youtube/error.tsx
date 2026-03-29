"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const YoutubeImportError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} />;
};

export default YoutubeImportError;
