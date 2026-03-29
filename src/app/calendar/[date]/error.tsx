"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const CalendarError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} message="캘린더를 불러올 수 없어요" />;
};

export default CalendarError;
