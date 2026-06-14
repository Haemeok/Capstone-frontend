import { localizePack } from "../ingredientPackMeta";

const pack = {
  name: "한식 기본 베이스",
  description: "한식 요리를 위한 필수 조미료와 재료",
  ingredients: [],
};

describe("localizePack", () => {
  it("ja 오버레이가 있으면 현지 name/description 반환 (T-10)", () => {
    const r = localizePack(pack, "ja");
    expect(r.name).not.toBe(pack.name);
    expect(/[가-힣]/.test(r.name + r.description)).toBe(false);
  });
  it("ko 또는 미등록은 입력값 fallback (T-10)", () => {
    expect(localizePack(pack, "ko")).toEqual({
      name: pack.name,
      description: pack.description,
    });
    const unknown = { ...pack, name: "없는팩", description: "x" };
    expect(localizePack(unknown, "ja")).toEqual({
      name: "없는팩",
      description: "x",
    });
  });
});
