import { LOCALE_COOKIE } from "../localeCookie";
import { resolveClientRequestLocale } from "../resolveClientRequestLocale";

describe("resolveClientRequestLocale (request-locale)", () => {
  beforeEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`;
    window.history.replaceState({}, "", "/");
  });

  const setCookie = (v: string) => {
    document.cookie = `${LOCALE_COOKIE}=${v}; path=/`;
  };

  it("T-P1-1: cookie=ja → 'ja' (cookie wins)", () => {
    setCookie("ja");
    expect(resolveClientRequestLocale()).toBe("ja");
  });

  it("T-P1-2: no cookie, path /en/x → 'en'", () => {
    window.history.replaceState({}, "", "/en/x");
    expect(resolveClientRequestLocale()).toBe("en");
  });

  it("T-P1-3: no cookie, path / → null", () => {
    expect(resolveClientRequestLocale()).toBeNull();
  });

  it("T-P1-4: cookie=ja, path /en/x → 'ja' (cookie over path)", () => {
    setCookie("ja");
    window.history.replaceState({}, "", "/en/x");
    expect(resolveClientRequestLocale()).toBe("ja");
  });
});
