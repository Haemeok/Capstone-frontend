"use client";

import { usePathname } from "next/navigation";

import { notificationsMessages } from "./notificationsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { NotificationsDict } from "./types";

export const useNotificationsDict = (): NotificationsDict =>
  notificationsMessages[resolveChromeLocale(usePathname() ?? "/")];
