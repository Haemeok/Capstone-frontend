"use client";

import { type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { AppStateInitializer } from "./AppStateInitializer";
import { PostHogPageView } from "./PostHogPageView";
import { PostHogProvider } from "./PostHogProvider";
import { ScrollProvider } from "./ScrollProvider";
import ToastProvider from "./ToastProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import { YoutubeExtractionPrompter } from "./YoutubeExtractionPrompter";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PostHogProvider>
      <PostHogPageView />
      <QueryClientProvider client={queryClient}>
        <ScrollProvider>
          <WebSocketProvider>
            <AppStateInitializer>{children}</AppStateInitializer>
            <ToastProvider />
            <YoutubeExtractionPrompter />
          </WebSocketProvider>
        </ScrollProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};
