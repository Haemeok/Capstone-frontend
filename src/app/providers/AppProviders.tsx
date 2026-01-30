"use client";

import { type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { AppStateInitializer } from "./AppStateInitializer";
import { KeyboardAwareProvider } from "./KeyboardAwareProvider";
import { PostHogPageView } from "./PostHogPageView";
import { PostHogProvider } from "./PostHogProvider";
import { PWAFirstLoginPrompter } from "./PWAFirstLoginPrompter";
import { PWAInstallProvider } from "./PWAInstallProvider";
import { ScrollProvider } from "./ScrollProvider";
import ToastProvider from "./ToastProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import { YoutubeExtractionPrompter } from "./YoutubeExtractionPrompter";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PostHogProvider>
      <PostHogPageView />
      <QueryClientProvider client={queryClient}>
        <PWAInstallProvider>
          <KeyboardAwareProvider>
            <ScrollProvider>
              <WebSocketProvider>
                <AppStateInitializer>{children}</AppStateInitializer>
              <ToastProvider />
                <PWAFirstLoginPrompter />
                <YoutubeExtractionPrompter />
              </WebSocketProvider>
            </ScrollProvider>
          </KeyboardAwareProvider>
        </PWAInstallProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};
