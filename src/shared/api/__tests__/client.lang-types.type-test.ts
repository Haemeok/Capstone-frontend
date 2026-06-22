import { api } from "../client";

export function _localeTypeGate() {
  // @ts-expect-error lang must be a Locale, not an arbitrary string
  api.get("/x", { lang: "EN" });
  // @ts-expect-error lang must be a Locale
  api.get("/x", { lang: "english" });
  api.get("/x", { lang: "ja" });
}
