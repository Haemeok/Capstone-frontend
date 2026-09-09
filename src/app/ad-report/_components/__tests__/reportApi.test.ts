import { fetchAdReport, ReportError } from "../reportApi";
import { reportFixture } from "./reportFixture";

describe("광고 리포트 조회 계약", () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
  });

  it("전용 헤더와 한국 날짜로 조회하고 로그인 쿠키와 캐시를 사용하지 않는다", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => reportFixture });
    const result = await fetchAdReport(
      "token",
      {
        period: { from: "2026-09-01", to: "2026-09-08" },
        placementCode: "recipe_steps_top",
      },
      new AbortController().signal
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url.searchParams.get("placementCode")).toBe("recipe_steps_top");
    expect(url.searchParams.get("from")).toBe("2026-09-01");
    expect(init).toMatchObject({
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      headers: { "X-Ad-Report-Token": "token" },
    });
    expect(url.href).not.toContain("token");
    expect(result.summary.ctrPercent).toBe(0.8);
  });

  it.each([401, 403, 429, 500])(
    "%s 오류를 자동 로그인 갱신이나 재시도 없이 반환한다",
    async (status) => {
      fetchMock.mockResolvedValue({
        ok: false,
        status,
        headers: new Headers(),
      });
      await expect(
        fetchAdReport("token", {}, new AbortController().signal)
      ).rejects.toMatchObject({ status });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );

  it("불완전한 통계를 정상 데이터로 표시하거나 응답 내용을 오류에 남기지 않는다", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ secret: "sensitive-response" }),
    });
    await expect(
      fetchAdReport("token", {}, new AbortController().signal)
    ).rejects.toEqual(new ReportError(502));
  });

  it("CTR null과 일반 노출보다 큰 가시 노출을 임의로 보정하지 않는다", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...reportFixture,
        summary: {
          impressions: 0,
          viewableImpressions: 2,
          clicks: 1,
          ctrPercent: null,
        },
      }),
    });
    const report = await fetchAdReport(
      "token",
      {},
      new AbortController().signal
    );
    expect(report.summary).toEqual({
      impressions: 0,
      viewableImpressions: 2,
      clicks: 1,
      ctrPercent: null,
    });
  });
});
