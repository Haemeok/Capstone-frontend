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

  it("배치 구간 경계마다 승인된 스티커 크기와 배치 흐름을 사용합니다", () => {
    const boundaryLayouts = [9, 10, 12, 13, 16, 17, 20, 21, 25, 26, 30].map(
      (count) => ({ count, ...getMonthlyShareLayout(count) })
    );

    expect(boundaryLayouts).toMatchInlineSnapshot(`
      [
        {
          "columns": 3,
          "count": 9,
          "density": "regular",
          "flow": "grid",
        },
        {
          "columns": 4,
          "count": 10,
          "density": "roomy",
          "flow": "centered-wrap",
        },
        {
          "columns": 4,
          "count": 12,
          "density": "roomy",
          "flow": "centered-wrap",
        },
        {
          "columns": 4,
          "count": 13,
          "density": "compact",
          "flow": "centered-wrap",
        },
        {
          "columns": 4,
          "count": 16,
          "density": "compact",
          "flow": "centered-wrap",
        },
        {
          "columns": 4,
          "count": 17,
          "density": "dense",
          "flow": "centered-wrap",
        },
        {
          "columns": 4,
          "count": 20,
          "density": "dense",
          "flow": "centered-wrap",
        },
        {
          "columns": 5,
          "count": 21,
          "density": "packed",
          "flow": "centered-wrap",
        },
        {
          "columns": 5,
          "count": 25,
          "density": "packed",
          "flow": "centered-wrap",
        },
        {
          "columns": 5,
          "count": 26,
          "density": "maximum",
          "flow": "centered-wrap",
        },
        {
          "columns": 5,
          "count": 30,
          "density": "maximum",
          "flow": "centered-wrap",
        },
      ]
    `);
  });

  it("31개 이상이면 최신 순서의 앞 30개만 사용합니다", () => {
    const items = Array.from({ length: 35 }, (_, index) => `record-${index}`);

    expect(selectMonthlyShareItems(items)).toEqual(items.slice(0, 30));
  });
});
