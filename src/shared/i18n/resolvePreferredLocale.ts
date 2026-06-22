import type { Locale } from "./types";

type Sources = {
  cookie: Locale | null;
  stored: Locale | null;
  account: Locale | null;
};

export const resolvePreferredLocale = ({
  cookie,
  stored,
  account,
}: Sources): Locale | null => cookie ?? stored ?? account ?? null;
