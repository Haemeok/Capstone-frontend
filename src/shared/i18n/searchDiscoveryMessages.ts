import { searchDiscovery as en } from "./messages/en/searchDiscovery";
import { searchDiscovery as ja } from "./messages/ja/searchDiscovery";
import { searchDiscovery as ko } from "./messages/ko/searchDiscovery";
import type { Locale, SearchDiscoveryDict } from "./types";

export const searchDiscoveryMessages: Record<Locale, SearchDiscoveryDict> = {
  ko,
  ja,
  en,
};
