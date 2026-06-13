import { getNextCardNewsPageParam } from "./pagination";

describe("getNextCardNewsPageParam", () => {
  it("다음 페이지가 있으면 다음 번호를 반환한다", () => {
    expect(getNextCardNewsPageParam({ number: 0, totalPages: 3 })).toBe(1);
  });

  it("마지막 페이지면 undefined를 반환한다 (over-fetch 방지)", () => {
    expect(
      getNextCardNewsPageParam({ number: 2, totalPages: 3 })
    ).toBeUndefined();
  });
});
