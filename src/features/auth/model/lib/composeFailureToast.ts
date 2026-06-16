import type { Locale } from "@/shared/i18n";
import { format } from "@/shared/i18n";

type ComposeFailureToastArgs = {
  template: string;
  locale: Locale;
  error: unknown;
  unknownText: string;
};

export const composeFailureToast = ({
  template,
  locale,
  error,
  unknownText,
}: ComposeFailureToastArgs): string => {
  const detail =
    locale === "ko" && error instanceof Error ? error.message : unknownText;
  return format(template, { message: detail });
};
