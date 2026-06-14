"use client";

import { usePathname } from "next/navigation";

import { errorsMessages } from "./errorsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { ErrorsDict } from "./types";

export const useErrorsDict = (): ErrorsDict =>
  errorsMessages[resolveChromeLocale(usePathname() ?? "/")];
