import { localizedHref, stripLocale } from "../localizedHref";

describe("localizedHref (T-01)", () => {
  it.each([
    ["/search", "ja", "/ja/search"],
    ["/search", "en", "/en/search"],
    ["/search", "ko", "/search"],
    ["/", "ja", "/ja"],
    ["/", "ko", "/"],
  ] as const)("(%s, %s) → %s", (path, locale, expected) => {
    expect(localizedHref(path, locale)).toBe(expected);
  });
});

describe("localizedHref 무변경 (T-02)", () => {
  it.each([
    ["https://x.com/a", "ja"],
    ["#top", "ja"],
    ["/ja/search", "ja"],
    ["/en/recipes/1", "ja"],
  ] as const)("(%s, %s) 그대로", (path, locale) => {
    expect(localizedHref(path, locale)).toBe(path);
  });
});

describe("stripLocale (T-05)", () => {
  it.each([
    ["/ja/recipes/1", "ja", "/recipes/1"],
    ["/recipes/1", "ko", "/recipes/1"],
    ["/ja", "ja", "/"],
    ["/engine", "ko", "/engine"],
  ] as const)("%s → {%s, %s}", (pathname, locale, barePath) => {
    expect(stripLocale(pathname)).toEqual({ locale, barePath });
  });
});
