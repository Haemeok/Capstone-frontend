import { parseStoredArray } from "../parseStoredArray";

const isString = (v: unknown): v is string => typeof v === "string";

describe("parseStoredArray", () => {
  it("null·빈 문자열은 빈 배열", () => {
    expect(parseStoredArray(null, isString)).toEqual([]);
    expect(parseStoredArray("", isString)).toEqual([]);
  });

  it("깨진 JSON은 빈 배열", () => {
    expect(parseStoredArray("{not json", isString)).toEqual([]);
  });

  it("배열이 아닌 JSON은 빈 배열", () => {
    expect(parseStoredArray('{"a":1}', isString)).toEqual([]);
    expect(parseStoredArray("42", isString)).toEqual([]);
    expect(parseStoredArray('"str"', isString)).toEqual([]);
  });

  it("모든 아이템이 유효하면 그 배열을 반환", () => {
    expect(parseStoredArray('["a","b"]', isString)).toEqual(["a", "b"]);
    expect(parseStoredArray("[]", isString)).toEqual([]);
  });

  it("아이템 하나라도 가드를 통과 못하면 전체를 버리고 빈 배열", () => {
    expect(parseStoredArray('["a",1,"b"]', isString)).toEqual([]);
    expect(parseStoredArray("[1,2,3]", isString)).toEqual([]);
  });
});
