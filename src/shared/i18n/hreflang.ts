import { absoluteUrl } from "@/shared/config/constants/api";

export const buildHreflangAlternates = (
  pathWithoutLocale: string
): Record<string, string> => ({
  ko: absoluteUrl(pathWithoutLocale),
  ja: absoluteUrl(`ja/${pathWithoutLocale}`),
  en: absoluteUrl(`en/${pathWithoutLocale}`),
  "x-default": absoluteUrl(pathWithoutLocale),
});
