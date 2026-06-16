"use client";

import { useErrorsDict } from "@/shared/i18n";
import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const CalendarError = ({ reset }: NextErrorProps) => {
  const errors = useErrorsDict();
  return <ErrorFallback reset={reset} message={errors.context.calendar} />;
};

export default CalendarError;
