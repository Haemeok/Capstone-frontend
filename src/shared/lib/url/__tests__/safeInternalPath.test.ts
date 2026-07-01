import { safeInternalPath } from "../safeInternalPath";

describe("safeInternalPath", () => {
  it("정상 내부 경로는 그대로 통과시킨다", () => {
    expect(safeInternalPath("/recipes/abc")).toBe("/recipes/abc");
    expect(safeInternalPath("/")).toBe("/");
    expect(safeInternalPath("/search?q=감자&sort=인기순")).toBe(
      "/search?q=감자&sort=인기순"
    );
  });

  it("빈 값·null·undefined는 fallback으로 되돌린다", () => {
    expect(safeInternalPath(null)).toBe("/");
    expect(safeInternalPath(undefined)).toBe("/");
    expect(safeInternalPath("")).toBe("/");
  });

  it("절대 URL(스킴 포함)은 외부라 fallback으로 막는다", () => {
    expect(safeInternalPath("https://evil.com")).toBe("/");
    expect(safeInternalPath("http://evil.com/path")).toBe("/");
    expect(safeInternalPath("javascript:alert(1)")).toBe("/");
  });

  it("protocol-relative(//, /\\)는 fallback으로 막는다", () => {
    expect(safeInternalPath("//evil.com")).toBe("/");
    expect(safeInternalPath("/\\evil.com")).toBe("/");
    expect(safeInternalPath("\\\\evil.com")).toBe("/");
  });

  it("경로가 아닌 값(선행 공백 후 //)도 막는다", () => {
    expect(safeInternalPath(" //evil.com")).toBe("/");
    expect(safeInternalPath("evil.com")).toBe("/");
  });

  it("fallback을 지정하면 그 값을 쓴다", () => {
    expect(safeInternalPath(null, "/login")).toBe("/login");
    expect(safeInternalPath("//evil.com", "/home")).toBe("/home");
  });
});
