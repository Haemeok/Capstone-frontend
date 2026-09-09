import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ReportDashboard } from "../ReportDashboard";
import { reportSchema } from "../reportSchema";
import { reportFixture } from "./reportFixture";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("../AdReportChart", () => ({
  AdReportChart: () => <div>추이 그래프</div>,
}));
jest.mock("../AdReportDatePicker", () => ({
  AdReportDatePicker: () => <button>조회 기간 선택</button>,
}));

describe("리포트 조회 조건과 결과", () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
  });
  const setup = (initialReport = reportFixture) =>
    render(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <ReportDashboard
          token="secret"
          sessionId={1}
          initialReport={reportSchema.parse(initialReport)}
        />
      </QueryClientProvider>
    );

  it("장기 캠페인의 일부 기간을 전체 요약으로 표시하지 않는다", () => {
    setup({
      ...reportFixture,
      campaign: {
        ...reportFixture.campaign,
        startAt: "2026-01-01T00:00:00+09:00",
      },
    });
    expect(
      screen.getByRole("heading", { name: "선택 기간·위치 요약" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "캠페인 전체 요약" })
    ).not.toBeInTheDocument();
  });

  it("서버 CTR을 백분율 그대로 표시하고 위치를 바꿔도 전체 위치 선택지가 남는다", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...reportFixture,
        period: { ...reportFixture.period, placementCode: "recipe_steps_top" },
        summary: {
          impressions: 0,
          viewableImpressions: 0,
          clicks: 0,
          ctrPercent: null,
        },
        byPlacement: [reportFixture.byPlacement[1]],
      }),
    });
    setup();
    expect(screen.getByText("0.80%")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "조리과정 상단" }));
    await screen.findByText("—");
    expect(
      screen.getByRole("button", { name: "레시피 정보 하단" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "전체" })).toBeInTheDocument();
  });

  it("뒤늦게 도착한 이전 위치의 응답이 최신 선택을 덮지 않는다", async () => {
    let resolveOld: (value: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        })
    );
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...reportFixture,
        period: { ...reportFixture.period, placementCode: "recipe_steps_top" },
        summary: { ...reportFixture.summary, ctrPercent: 1.23 },
      }),
    });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "레시피 정보 하단" }));
    fireEvent.click(screen.getByRole("button", { name: "조리과정 상단" }));
    await screen.findByText("1.23%");
    resolveOld({ ok: true, json: async () => reportFixture });
    await waitFor(() => expect(screen.getByText("1.23%")).toBeInTheDocument());
  });

  it("새로고침 중 인증이 만료되면 이전 캠페인 통계를 숨긴다", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers(),
    });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "새로고침" }));
    await screen.findByText("리포트 링크를 확인해 주세요");
    expect(
      screen.queryByText(reportFixture.campaign.name)
    ).not.toBeInTheDocument();
  });
});
