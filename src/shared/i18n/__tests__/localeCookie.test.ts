import {
  buildLocaleCookieString,
  getLocaleCookie,
  LOCALE_COOKIE,
  setLocaleCookie,
} from "../localeCookie";

describe("localeCookie", () => {
  afterEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`;
  });

  it("T-09: setLocaleCookie writes preferred_locale cookie", () => {
    setLocaleCookie("en");
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=en`);
  });

  it("getLocaleCookie reads the written locale", () => {
    setLocaleCookie("ja");
    expect(getLocaleCookie()).toBe("ja");
  });

  it("getLocaleCookie returns null when unset or invalid", () => {
    expect(getLocaleCookie()).toBeNull();
  });

  it("T-M-1: buildLocaleCookieString(_, true) adds secure and keeps lax + max-age", () => {
    const str = buildLocaleCookieString("ja", true);
    expect(str).toContain("secure");
    expect(str).toContain("samesite=lax");
    expect(str).toContain("max-age=");
    expect(str).toContain(`${LOCALE_COOKIE}=ja`);
  });

  it("T-M-2: buildLocaleCookieString(_, false) omits secure", () => {
    expect(buildLocaleCookieString("ja", false)).not.toContain("secure");
  });
});
