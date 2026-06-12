import { format, plural } from "../format";

describe("format", () => {
  it("토큰을 vars로 치환한다", () => {
    expect(format("📌 {q} {count}선", { q: "라멘", count: 12 })).toBe(
      "📌 라멘 12선"
    );
  });
  it("동일 토큰 반복도 모두 치환한다", () => {
    expect(format("{x}-{x}", { x: "a" })).toBe("a-a");
  });
  it("매칭 안 되는 토큰은 빈 문자열로 둔다", () => {
    expect(format("a{missing}b", {})).toBe("ab");
  });
});

describe("plural (T-42)", () => {
  const forms = { one: "{count} recipe", other: "{count} recipes" };
  it("n=1 → one", () => {
    expect(plural(1, forms)).toBe("{count} recipe");
  });
  it("n=0 → other", () => {
    expect(plural(0, forms)).toBe("{count} recipes");
  });
  it("n=2 → other", () => {
    expect(plural(2, forms)).toBe("{count} recipes");
  });
});
