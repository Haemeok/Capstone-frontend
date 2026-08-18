import { render, screen, within } from "@testing-library/react";

import { MonthlyCookingRecordSummary } from "../_components/MonthlyCookingRecordSummary";

describe("MonthlyCookingRecordSummary", () => {
  it("월간 요리 횟수와 세 가지 성과를 같은 요약 영역에 표시합니다", () => {
    render(
      <MonthlyCookingRecordSummary
        ariaLabel="이번 달 요리 성과"
        title="이번 달 18번 요리했어요"
        cookingDays={{ value: "12일", label: "요리한 날" }}
        savings={{
          value: "48,300원",
          label: "아낀 금액",
        }}
        uniqueDishes={{ value: "11가지", label: "만든 요리" }}
      />
    );

    const summary = screen.getByRole("region", { name: "이번 달 요리 성과" });
    expect(
      within(summary).getByRole("heading", {
        level: 2,
        name: "이번 달 18번 요리했어요",
      })
    ).toHaveClass("text-[22px]");
    expect(within(summary).getByText("12일")).toHaveClass("text-[17px]");
    expect(within(summary).getByText("요리한 날")).toHaveClass("text-xs");
    expect(within(summary).getByText("아낀 금액")).toHaveClass("text-xs");
    expect(within(summary).getByText("만든 요리")).toHaveClass("text-xs");
    expect(within(summary).getByText("48,300원")).toBeInTheDocument();
    expect(
      within(summary).queryByText("정보가 있는 기록 기준")
    ).not.toBeInTheDocument();
    expect(within(summary).getByText("11가지")).toBeInTheDocument();
  });
});
