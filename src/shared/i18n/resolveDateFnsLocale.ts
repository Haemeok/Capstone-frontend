import { enUS, ja, ko } from "date-fns/locale";

import type { Locale } from "./types";

export const resolveDateFnsLocale = (locale: Locale): typeof ko =>
  locale === "ja" ? ja : locale === "en" ? enUS : ko;
