"use client";

import { ReactNode } from "react";

import { useAuthManager } from "@/shared/lib/auth/useAuthManager";

import { useMyInfoQuery } from "@/entities/user/model/hooks";

type AppStateInitializerProps = {
  children: ReactNode;
};

export const AppStateInitializer = ({ children }: AppStateInitializerProps) => {
  useAuthManager();

  useMyInfoQuery();

  return <>{children}</>;
};
