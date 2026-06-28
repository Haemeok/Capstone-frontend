"use client";

import { ReactNode } from "react";

import { useLocalePreferenceSync } from "@/shared/i18n";
import { useAuthDiagBridge } from "@/shared/lib/bridge";

import { useMyInfoQuery } from "@/entities/user/model/hooks";

import { useAuthManager } from "@/features/auth/model/useAuthManager";

type AppStateInitializerProps = {
  children: ReactNode;
};

export const AppStateInitializer = ({ children }: AppStateInitializerProps) => {
  useAuthManager();
  useAuthDiagBridge();

  const { user } = useMyInfoQuery();
  useLocalePreferenceSync(user?.preferredLocale ?? null);

  return <>{children}</>;
};
