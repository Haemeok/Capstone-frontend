export { DictionaryProvider, useT } from "./DictionaryProvider";
export { format, plural } from "./format";
export { getDictionary } from "./getDictionary";
export { buildHreflangAlternates } from "./hreflang";
export { localizedHref, stripLocale } from "./localizedHref";
export { LocalizedLink } from "./LocalizedLink";
export { getStoredLocale, setStoredLocale } from "./preferredLocale";
export { resolveChromeLocale } from "./resolveChromeLocale";
export { resolveLocaleFromPath } from "./resolveLocaleFromPath";
export type {
  Dictionary,
  FridgeDict,
  Locale,
  NavDict,
  Plural,
  UserPagesDict,
  YoutubeDict,
} from "./types";
export { LOCALES } from "./types";
export { useApiLocale } from "./useApiLocale";
export { useChromeDict, useChromeLocale } from "./useChromeDict";
export { useFridgeDict } from "./useFridgeDict";
export { useUserPagesDict, useUserPagesLocale } from "./useUserPagesDict";
