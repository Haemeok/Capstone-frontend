import { campaignDates } from "../reportFormat";
import { reportSchema } from "../reportSchema";
import { reportFixture } from "./reportFixture";

describe("한국 시간 집행 기간", () => {
  afterEach(() => jest.useRealTimers());
  it("UTC 날짜가 달라도 한국 날짜를 사용하고 종료 시각은 미포함한다", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-09-08T16:00:00Z"));
    expect(campaignDates(reportSchema.parse(reportFixture))).toEqual({
      from: "2026-09-01",
      to: "2026-09-30",
      maxDate: "2026-09-09",
    });
  });
  it("시작 전 캠페인은 시작일 하루를 조회 가능하게 한다", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-08-31T01:00:00Z"));
    expect(campaignDates(reportSchema.parse(reportFixture)).maxDate).toBe(
      "2026-09-01"
    );
  });
});
