"use client";

import type { ReactNode } from "react";

import { AdSenseScript } from "@/shared/adsense";
import { AppContextBridge } from "@/shared/lib/analytics";
import { AppWebViewDetector } from "@/shared/lib/bridge";

import { BottomLayoutController } from "@/widgets/Footer/BottomLayoutController";
import BottomNavBar from "@/widgets/Footer/BottomNavBar";
import DesktopHeader from "@/widgets/Header/DesktopHeader";

import GlobalDrawers from "./GlobalDrawers";
import GoogleAnalytics from "./GoogleAnalytics";
import { AppProviders } from "./providers/AppProviders";

const ServiceShell = ({ children }: { children: ReactNode }) => (
  <>
    <AppWebViewDetector />
    <AppProviders>
      <DesktopHeader />
      <main className="flex w-full flex-1 flex-col pb-[var(--main-pb,var(--bottom-nav-h))] md:pb-0">
        {children}
      </main>
      <BottomNavBar />
      <BottomLayoutController />
      <GlobalDrawers />
      <AdSenseScript />
    </AppProviders>
    <GoogleAnalytics />
    <AppContextBridge />
  </>
);

export default ServiceShell;
