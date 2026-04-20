"use client";

import { ReactNode } from "react";

import { useAuthManager } from "@/shared/lib/auth/useAuthManager";
import { useAuthDiagBridge } from "@/shared/lib/bridge";

import { useMyInfoQuery } from "@/entities/user/model/hooks";

type AppStateInitializerProps = {
  children: ReactNode;
};

export const AppStateInitializer = ({ children }: AppStateInitializerProps) => {
  useAuthManager();
  useAuthDiagBridge();

  useMyInfoQuery();

  return <>{children}</>;
};
