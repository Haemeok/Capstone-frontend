import { getMonthlyShareLayout, selectMonthlyShareItems } from "../shareLayout";

describe("월간 요리 기록 공유 배치", () => {
  it.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 2],
    [5, 3],
    [9, 3],
    [10, 4],
    [20, 4],
    [21, 5],
    [30, 5],
    [31, 5],
  ])("이미지 %i개에는 %i열을 사용합니다", (count, columns) => {
    expect(getMonthlyShareLayout(count).columns).toBe(columns);
  });

  it("31개 이상이면 최신 순서의 앞 30개만 사용합니다", () => {
    const items = Array.from({ length: 35 }, (_, index) => `record-${index}`);

    expect(selectMonthlyShareItems(items)).toEqual(items.slice(0, 30));
  });
});
