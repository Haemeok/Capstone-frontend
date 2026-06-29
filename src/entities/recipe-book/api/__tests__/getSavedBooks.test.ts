import { toSavedBook } from "../getSavedBooks";

describe("toSavedBook", () => {
  it("default:true를 isDefault:true로 매핑한다", () => {
    const raw = { id: "b1", name: "내 북", default: true };
    expect(toSavedBook(raw)).toEqual({
      id: "b1",
      name: "내 북",
      isDefault: true,
    });
  });

  it("default:false를 isDefault:false로 매핑한다", () => {
    const raw = { id: "b2", name: "북2", default: false };
    expect(toSavedBook(raw).isDefault).toBe(false);
  });

  it("default 키가 없으면 isDefault는 false다", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = { id: "b3", name: "북3" } as any;
    expect(toSavedBook(raw).isDefault).toBe(false);
  });
});
