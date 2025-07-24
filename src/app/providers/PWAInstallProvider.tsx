"use client";

import { createContext, type ReactNode, useContext } from "react";

import { usePWAInstall } from "@/shared/hooks/usePWAInstall";

type PWAInstallContextType = ReturnType<typeof usePWAInstall>;

const PWAInstallContext = createContext<PWAInstallContextType | null>(null);

export const PWAInstallProvider = ({ children }: { children: ReactNode }) => {
  const pwaInstallState = usePWAInstall();

  return (
    <PWAInstallContext.Provider value={pwaInstallState}>
      {children}
    </PWAInstallContext.Provider>
  );
};

export const usePWAInstallContext = () => {
  const context = useContext(PWAInstallContext);
  if (!context) {
    throw new Error(
      "usePWAInstallContext must be used within a PWAInstallProvider"
    );
  }
  return context;
};
