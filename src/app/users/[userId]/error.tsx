"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const UserProfileError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} />;
};

export default UserProfileError;
