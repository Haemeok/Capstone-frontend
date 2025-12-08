"use client";

import { type ReactNode, Suspense } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";
import { ServerAuthResult } from "@/shared/types";

import { AppStateInitializer } from "./AppStateInitializer";
import { PWAFirstLoginPrompter } from "./PWAFirstLoginPrompter";
import { PWAInstallProvider } from "./PWAInstallProvider";
import { ScrollProvider } from "./ScrollProvider";
import ToastProvider from "./ToastProvider";
import { WebSocketProvider } from "./WebSocketProvider";

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
            <Suspense fallback={null}>
              <AppStateInitializer myInfo={myInfo}>
                {children}
              </AppStateInitializer>
            </Suspense>
            <ToastProvider />
            <PWAFirstLoginPrompter />
          </WebSocketProvider>
        </ScrollProvider>
      </PWAInstallProvider>
    </QueryClientProvider>
  );
};
