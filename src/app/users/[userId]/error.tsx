"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const UserProfileError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} />;
};

export default UserProfileError;
