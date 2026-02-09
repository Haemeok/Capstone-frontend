"use client";

import { type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { AIRecipeProvider } from "./AIRecipeProvider";
import { AppStateInitializer } from "./AppStateInitializer";
import { PostHogPageView } from "./PostHogPageView";
import { PostHogProvider } from "./PostHogProvider";
import { ScrollProvider } from "./ScrollProvider";
import ToastProvider from "./ToastProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import { YoutubeExtractionPrompter } from "./YoutubeExtractionPrompter";
import { YoutubeImportProvider } from "./YoutubeImportProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PostHogProvider>
      <PostHogPageView />
      <QueryClientProvider client={queryClient}>
        <ScrollProvider>
          <WebSocketProvider>
            <YoutubeImportProvider>
              <AIRecipeProvider>
                <AppStateInitializer>{children}</AppStateInitializer>
              </AIRecipeProvider>
            </YoutubeImportProvider>
            <ToastProvider />
            <YoutubeExtractionPrompter />
          </WebSocketProvider>
        </ScrollProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};
