"use client";

import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import ToastProvider from "./ToastProvider";
import { ScrollProvider } from "./ScrollProvider";
import { PWAInstallProvider } from "./PWAInstallProvider";
import { PWAFirstLoginPrompter } from "./PWAFirstLoginPrompter";
import { WebSocketProvider } from "./WebSocketProvider";

import { queryClient } from "@/shared/lib/queryClient";
import { AppStateInitializer } from "./AppStateInitializer";
import { ServerAuthResult } from "@/shared/types";

export const AppProviders = ({
  children,
  myInfo,
}: {
  children: ReactNode;
  myInfo?: ServerAuthResult;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PWAInstallProvider>
        <ScrollProvider>
          <WebSocketProvider>
            <AppStateInitializer myInfo={myInfo}>
              {children}
            </AppStateInitializer>
            <ToastProvider />
            <PWAFirstLoginPrompter />
          </WebSocketProvider>
        </ScrollProvider>
      </PWAInstallProvider>
    </QueryClientProvider>
  );
};
