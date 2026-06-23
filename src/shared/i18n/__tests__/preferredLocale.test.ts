import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { getLocaleCookie, LOCALE_COOKIE } from "../localeCookie";
import {
  clearStoredLocale,
  getStoredLocale,
  setStoredLocale,
} from "../preferredLocale";

describe("preferredLocale (T-06)", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`;
  });

  it("미설정 → null", () => {
    expect(getStoredLocale()).toBeNull();
  });

  it("유효 locale 저장 → 반환", () => {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, "ja");
    expect(getStoredLocale()).toBe("ja");
  });

  it("미지원/빈 값 → null", () => {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, "de");
    expect(getStoredLocale()).toBeNull();
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, "");
    expect(getStoredLocale()).toBeNull();
  });

  it("setStoredLocale 왕복", () => {
    setStoredLocale("en");
    expect(getStoredLocale()).toBe("en");
  });

  it("setStoredLocale also writes the preferred_locale cookie", () => {
    setStoredLocale("en");
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=en`);
  });

  it("clearStoredLocale wipes both localStorage and the cookie so the preference cannot resurrect", () => {
    setStoredLocale("ja");

    clearStoredLocale();

    expect(getStoredLocale()).toBeNull();
    expect(getLocaleCookie()).toBeNull();
  });
});
