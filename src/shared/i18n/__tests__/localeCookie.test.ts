import {
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
});
