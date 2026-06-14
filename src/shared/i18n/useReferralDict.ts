"use client";

import { usePathname } from "next/navigation";

import { referralMessages } from "./referralMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { ReferralDict } from "./types";

export const useReferralDict = (): ReferralDict =>
  referralMessages[resolveChromeLocale(usePathname() ?? "/")];
