import { resolveChromeLocale } from "../resolveChromeLocale";

describe("resolveChromeLocale (T-04)", () => {
  it.each([
    ["/", "ko"],
    ["/recipes/1", "ko"],
    ["/en", "en"],
    ["/en/", "en"],
    ["/en/recipes/1", "en"],
    ["/ja", "ja"],
    ["/ja/search/results", "ja"],
    ["/engine", "ko"],
    ["/news", "ko"],
    ["/english", "ko"],
  ] as const)("%s → %s (세그먼트 경계 안전)", (path, expected) => {
    expect(resolveChromeLocale(path)).toBe(expected);
  });
});
