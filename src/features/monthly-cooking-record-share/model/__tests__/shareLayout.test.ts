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
    [20, 5],
    [21, 5],
    [30, 6],
    [31, 6],
  ])("이미지 %i개에는 %i열을 사용합니다", (count, columns) => {
    expect(getMonthlyShareLayout(count).columns).toBe(columns);
  });

  it("배치 구간 경계마다 승인된 열 수와 스티커 크기를 사용합니다", () => {
    const boundaryLayouts = [9, 10, 12, 13, 16, 17, 20, 21, 25, 26, 30].map(
      (count) => ({ count, ...getMonthlyShareLayout(count) })
    );

    expect(boundaryLayouts).toMatchInlineSnapshot(`
      [
        {
          "columns": 3,
          "count": 9,
          "itemSize": 84,
        },
        {
          "columns": 4,
          "count": 10,
          "itemSize": 78,
        },
        {
          "columns": 4,
          "count": 12,
          "itemSize": 78,
        },
        {
          "columns": 4,
          "count": 13,
          "itemSize": 62,
        },
        {
          "columns": 4,
          "count": 16,
          "itemSize": 62,
        },
        {
          "columns": 5,
          "count": 17,
          "itemSize": 62,
        },
        {
          "columns": 5,
          "count": 20,
          "itemSize": 62,
        },
        {
          "columns": 5,
          "count": 21,
          "itemSize": 50,
        },
        {
          "columns": 5,
          "count": 25,
          "itemSize": 50,
        },
        {
          "columns": 6,
          "count": 26,
          "itemSize": 50,
        },
        {
          "columns": 6,
          "count": 30,
          "itemSize": 50,
        },
      ]
    `);
  });

  it("31개 이상이면 최신 순서의 앞 30개만 사용합니다", () => {
    const items = Array.from({ length: 35 }, (_, index) => `record-${index}`);

    expect(selectMonthlyShareItems(items)).toEqual(items.slice(0, 30));
  });
});
