import { computeDeliveryEstimate } from "../computeDeliveryEstimate";

describe("computeDeliveryEstimate", () => {
  it("일요일 기준 내일은 월 (T-09)", () => {
    expect(computeDeliveryEstimate(new Date("2026-07-05T09:00:00+09:00"))).toBe(
      "내일(월) 도착 예정"
    );
  });

  it("토요일 기준 내일은 일 (T-10)", () => {
    expect(computeDeliveryEstimate(new Date("2026-07-04T09:00:00+09:00"))).toBe(
      "내일(일) 도착 예정"
    );
  });
});
