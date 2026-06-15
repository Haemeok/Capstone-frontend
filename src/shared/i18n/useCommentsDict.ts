"use client";

import { usePathname } from "next/navigation";

import { commentsMessages } from "./commentsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { CommentsDict } from "./types";

export const useCommentsDict = (): CommentsDict =>
  commentsMessages[resolveChromeLocale(usePathname() ?? "/")];
