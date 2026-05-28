import { prunePending } from "./prunePending";

describe("prunePending", () => {
  it("pending 가 비어있으면 selected 를 그대로 (같은 참조) 반환", () => {
    const selected = new Set(["a", "b"]);
    const out = prunePending(selected, new Set());
    expect(out).toBe(selected);
  });

  it("selected 가 비어있으면 빈 Set 반환", () => {
    const out = prunePending(new Set(), new Set(["a"]));
    expect(out.size).toBe(0);
  });

  it("겹치는 항목은 제거, 안 겹치는 항목은 유지", () => {
    const selected = new Set(["a", "b", "c"]);
    const pending = new Set(["b", "d"]);
    const out = prunePending(selected, pending);
    expect([...out].sort()).toEqual(["a", "c"]);
  });

  it("완전히 disjoint 면 selected 와 동일한 멤버 (새 Set)", () => {
    const selected = new Set(["a", "b"]);
    const pending = new Set(["c", "d"]);
    const out = prunePending(selected, pending);
    expect([...out].sort()).toEqual(["a", "b"]);
  });

  it("모두 겹치면 빈 Set", () => {
    const selected = new Set(["a", "b"]);
    const pending = new Set(["a", "b", "c"]);
    const out = prunePending(selected, pending);
    expect(out.size).toBe(0);
  });
});
