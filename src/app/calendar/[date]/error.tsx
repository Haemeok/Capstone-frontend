"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const CalendarError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="캘린더를 불러올 수 없어요" />;
};

export default CalendarError;
