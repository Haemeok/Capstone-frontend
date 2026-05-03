import { slugify } from "./slugify";

describe("slugify", () => {
  it("키 순서가 달라도 같은 slug를 만든다", () => {
    const a = slugify({ dishType: "찌개", season: "겨울" });
    const b = slugify({ season: "겨울", dishType: "찌개" });
    expect(a).toBe(b);
  });

  it("한글 값을 안전하게 인코딩한다", () => {
    const s = slugify({ dishType: "찌개" });
    expect(s).toMatch(/^[a-f0-9]{12}$/);
  });

  it("값이 다르면 다른 slug가 나온다", () => {
    expect(slugify({ a: "1" })).not.toBe(slugify({ a: "2" }));
  });

  it("같은 입력은 항상 같은 출력 (deterministic)", () => {
    const s1 = slugify({ a: "1", b: "2" });
    const s2 = slugify({ a: "1", b: "2" });
    expect(s1).toBe(s2);
  });
});
