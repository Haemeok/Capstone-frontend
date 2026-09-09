import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { triggerHaptic } from "@/shared/lib/bridge";

import { AdReportChart } from "../AdReportChart";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

class ResizeObserverMock implements ResizeObserver {
  disconnect = jest.fn();
  observe = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "PointerEvent", {
  configurable: true,
  value: MouseEvent,
});

const daily = [
  {
    date: "2026-09-01",
    impressions: 1200,
    viewableImpressions: 900,
    clicks: 24,
    ctrPercent: 2,
  },
  {
    date: "2026-09-02",
    impressions: 2000,
    viewableImpressions: 1450,
    clicks: 30,
    ctrPercent: null,
  },
  {
    date: "2026-09-03",
    impressions: 800,
    viewableImpressions: 620,
    clicks: 30,
    ctrPercent: 3.14159,
  },
];

const longDaily = Array.from({ length: 93 }, (_, index) => ({
  date: new Date(Date.UTC(2026, 5, index + 1)).toISOString().slice(0, 10),
  impressions: index * 10,
  viewableImpressions: index * 8,
  clicks: index,
  ctrPercent: index / 10,
}));

const rect = (width: number, height: number): DOMRect => ({
  bottom: height,
  height,
  left: 0,
  right: width,
  top: 0,
  width,
  x: 0,
  y: 0,
  toJSON: () => ({}),
});

describe("AdReportChart", () => {
  beforeEach(() => {
    jest.mocked(triggerHaptic).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("여러 지표를 함께 비교하되 마지막 지표는 끌 수 없게 유지합니다", async () => {
    const user = userEvent.setup();

    render(<AdReportChart daily={daily} />);

    const impressions = screen.getByRole("button", { name: /일반 노출/ });
    const viewable = screen.getByRole("button", { name: /가시 노출/ });
    const clicks = screen.getByRole("button", { name: /클릭 \(Clicks\)/ });
    const ctr = screen.getByRole("button", { name: /클릭률/ });

    expect(impressions).toHaveAttribute("aria-pressed", "true");
    expect(viewable).toHaveAttribute("aria-pressed", "false");
    expect(clicks).toHaveAttribute("aria-pressed", "true");
    expect(ctr).toHaveAttribute("aria-pressed", "true");

    await user.click(viewable);

    expect(viewable).toHaveAttribute("aria-pressed", "true");
    expect(triggerHaptic).toHaveBeenLastCalledWith("Light");

    await user.click(impressions);
    await user.click(ctr);
    await user.click(viewable);
    jest.mocked(triggerHaptic).mockClear();
    await user.click(clicks);

    expect(clicks).toHaveAttribute("aria-pressed", "true");
    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it("서버의 null 클릭률을 선의 빈 구간과 툴팁의 대시로 표시합니다", () => {
    const { container } = render(<AdReportChart daily={daily} />);
    const ctrPath = container.querySelector('[data-series="ctr"]');
    const timeline = screen.getByRole("slider", { name: /날짜별 성과 탐색/ });

    expect(ctrPath?.getAttribute("d")?.match(/M/g)).toHaveLength(2);
    expect(screen.getAllByRole("slider")).toHaveLength(1);

    fireEvent.focus(timeline);
    fireEvent.keyDown(timeline, { key: "ArrowRight" });

    expect(screen.getByRole("status")).toHaveTextContent("9월 2일");
    expect(screen.getByRole("status")).toHaveTextContent("클릭률 (CTR)—");
  });

  it("포인터에서 가장 가까운 날짜의 서버 수치를 툴팁에 표시합니다", () => {
    render(<AdReportChart daily={daily} />);
    const timeline = screen.getByRole("slider", { name: /날짜별 성과 탐색/ });
    const svg = timeline.closest("svg");
    const chartWrap = svg?.parentElement;

    if (!svg || !chartWrap) throw new Error("차트 요소를 찾지 못했습니다.");

    jest.spyOn(svg, "getBoundingClientRect").mockReturnValue(rect(1000, 280));
    jest
      .spyOn(chartWrap, "getBoundingClientRect")
      .mockReturnValue(rect(1000, 280));
    jest
      .spyOn(HTMLElement.prototype, "offsetWidth", "get")
      .mockReturnValue(210);
    jest
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockReturnValue(100);

    fireEvent.pointerMove(timeline, {
      clientX: 900,
      clientY: 120,
      pointerType: "mouse",
    });

    const tooltip = screen.getByRole("status");
    expect(tooltip).toHaveTextContent("9월 3일");
    expect(tooltip).toHaveTextContent(/일반 노출\s*800회/);
    expect(tooltip).toHaveTextContent(/클릭\s*30회/);
    expect(tooltip).toHaveTextContent("클릭률 (CTR)3.14%");
    expect(tooltip).toHaveStyle({ left: "729px", top: "8px" });
  });

  it.each([
    { width: 360, expectedTickCount: 4 },
    { width: 1000, expectedTickCount: 8 },
  ])(
    "$width px에서도 93일 날짜 축을 $expectedTickCount개로 줄이고 양 끝 날짜를 유지합니다",
    ({ width, expectedTickCount }) => {
      jest
        .spyOn(HTMLElement.prototype, "getBoundingClientRect")
        .mockReturnValue(rect(width, 280));
      const { container } = render(<AdReportChart daily={longDaily} />);
      const renderedDateLabels = Array.from(
        container.querySelectorAll("[data-date-tick]")
      ).map((element) => element.textContent);

      expect(renderedDateLabels).toHaveLength(expectedTickCount);
      expect(renderedDateLabels[0]).toBe("6.1");
      expect(renderedDateLabels.at(-1)).toBe("9.1");
    }
  );
});
