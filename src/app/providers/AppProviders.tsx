"use client";

import { type ReactNode, Suspense } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { AppStateInitializer } from "./AppStateInitializer";
import { PWAFirstLoginPrompter } from "./PWAFirstLoginPrompter";
import { PWAInstallProvider } from "./PWAInstallProvider";
import { ScrollProvider } from "./ScrollProvider";
import ToastProvider from "./ToastProvider";
import { WebSocketProvider } from "./WebSocketProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PWAInstallProvider>
        <ScrollProvider>
          <WebSocketProvider>
            <AppStateInitializer>{children}</AppStateInitializer>
            <ToastProvider />
            <PWAFirstLoginPrompter />
          </WebSocketProvider>
        </ScrollProvider>
      </PWAInstallProvider>
    </QueryClientProvider>
  );
};
