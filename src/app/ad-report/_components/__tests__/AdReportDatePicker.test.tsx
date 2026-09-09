import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdReportDatePicker } from "../AdReportDatePicker";
import {
  getInclusiveDayCount,
  getRecentRange,
} from "../adReportDatePicker.helpers";

const mockTriggerHaptic = jest.fn();

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: (...args: unknown[]) => mockTriggerHaptic(...args),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

beforeEach(() => {
  mockTriggerHaptic.mockClear();
});

describe("AdReportDatePicker", () => {
  it("취소하면 임시 선택을 버리고 다음 열기에서 적용된 기간을 복원합니다", async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();

    render(
      <AdReportDatePicker
        value={{ from: "2026-05-01", to: "2026-05-07" }}
        minDate="2026-01-01"
        maxDate="2026-05-31"
        onApply={onApply}
      />
    );

    await user.click(screen.getByRole("button", { name: /조회 기간 선택/ }));
    await user.click(
      await screen.findByRole("button", { name: /2026년 5월 14일/ })
    );
    expect(
      screen.getByText(
        "종료일을 선택해 주세요. 최대 93일까지 조회할 수 있습니다."
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /2026년 5월 15일/ }));
    expect(screen.getByText("5월 14일 – 5월 15일 · 2일간")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "취소" }));
    expect(onApply).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /조회 기간 선택/ }));
    expect(screen.getByText("5월 1일 – 5월 7일 · 7일간")).toBeInTheDocument();
  });

  it("빠른 선택은 적용을 누른 뒤에만 외부 기간을 갱신합니다", async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();

    render(
      <AdReportDatePicker
        value={{ from: "2026-05-01", to: "2026-05-31" }}
        minDate="2026-01-01"
        maxDate="2026-05-31"
        onApply={onApply}
      />
    );

    await user.click(screen.getByRole("button", { name: /조회 기간 선택/ }));
    await user.click(screen.getByRole("button", { name: "최근 93일" }));

    expect(onApply).not.toHaveBeenCalled();
    expect(mockTriggerHaptic).toHaveBeenCalledWith("Light");

    await user.click(screen.getByRole("button", { name: "적용" }));
    expect(onApply).toHaveBeenCalledWith({
      from: "2026-02-28",
      to: "2026-05-31",
    });
  });

  it("월말을 가로지르는 93일을 양끝 포함 최대 기간으로 계산합니다", () => {
    const range = getRecentRange("2026-05-31", "2026-01-01", 93);

    expect(range).toEqual({ from: "2026-02-28", to: "2026-05-31" });
    expect(getInclusiveDayCount(range)).toBe(93);
    expect(getInclusiveDayCount({ from: "2026-02-27", to: "2026-05-31" })).toBe(
      94
    );
  });

  it("Escape로 닫으면 적용하지 않고 트리거로 포커스를 돌려줍니다", async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();

    render(
      <AdReportDatePicker
        value={{ from: "2026-05-01", to: "2026-05-07" }}
        minDate="2026-01-01"
        maxDate="2026-05-31"
        onApply={onApply}
      />
    );

    const trigger = screen.getByRole("button", { name: /조회 기간 선택/ });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(onApply).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
