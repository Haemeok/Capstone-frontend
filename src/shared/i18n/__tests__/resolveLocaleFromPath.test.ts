import { resolveLocaleFromPath } from "../resolveLocaleFromPath";

describe("resolveLocaleFromPath", () => {
  it.each([
    ["/ja", "ja"],
    ["/ja/", "ja"],
    ["/ja/recipes/my-fridge", "ja"],
    ["/en", "en"],
    ["/en/", "en"],
    ["/en/ingredients", "en"],
  ] as const)("%s → %s (명시 prefix만 해석)", (path, expected) => {
    expect(resolveLocaleFromPath(path)).toBe(expected);
  });

  it.each([
    ["/"],
    ["/recipes/my-fridge"],
    ["/ingredients"],
    ["/engine"],
    ["/english"],
    ["/news"],
  ] as const)("%s → null (prefix 없으면 ko 강제 안 함)", (path) => {
    expect(resolveLocaleFromPath(path)).toBeNull();
  });
});
