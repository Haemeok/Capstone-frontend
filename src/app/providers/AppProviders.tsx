"use client";

import { type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { ReferralSheetHost } from "@/features/referral";

import { AdsGateProvider } from "./AdsGateProvider";
import { AIRecipeProvider } from "./AIRecipeProvider";
import { AppStateInitializer } from "./AppStateInitializer";
import { GuestCartMigrator } from "./GuestCartMigrator";
import { InternalNavTracker } from "./InternalNavTracker";
import { KeyboardAwareProvider } from "./KeyboardAwareProvider";
import { PostHogAppContext } from "./PostHogAppContext";
import { PostHogPageView } from "./PostHogPageView";
import { PostHogProvider } from "./PostHogProvider";
import { ScrollProvider } from "./ScrollProvider";
import { SentryUserSync } from "./SentryUserSync";
import ToastProvider from "./ToastProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import { YoutubeExtractionPrompter } from "./YoutubeExtractionPrompter";
import { YoutubeImportProvider } from "./YoutubeImportProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PostHogProvider>
      <PostHogAppContext />
      <PostHogPageView />
      <InternalNavTracker />
      <SentryUserSync />
      <QueryClientProvider client={queryClient}>
        <ScrollProvider>
          <WebSocketProvider>
            <YoutubeImportProvider>
              <AIRecipeProvider>
                <AppStateInitializer>
                  <AdsGateProvider>
                    <KeyboardAwareProvider>{children}</KeyboardAwareProvider>
                  </AdsGateProvider>
                  <ReferralSheetHost />
                </AppStateInitializer>
              </AIRecipeProvider>
            </YoutubeImportProvider>
            <ToastProvider />
            <YoutubeExtractionPrompter />
            <GuestCartMigrator />
          </WebSocketProvider>
        </ScrollProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};
