import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

export const updatePreferredLocale = (locale: Locale): Promise<unknown> =>
  api.put(END_POINTS.PREFERRED_LOCALE, { locale });
