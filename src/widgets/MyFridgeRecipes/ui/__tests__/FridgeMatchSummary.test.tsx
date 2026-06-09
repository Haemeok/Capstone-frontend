import { fireEvent, render, screen } from "@testing-library/react";

import FridgeMatchSummary from "../FridgeMatchSummary";

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

describe("FridgeMatchSummary", () => {
  it("빠진 재료가 없으면 '바로 완성'을 보이고 부족 표시가 없다 (T-01)", () => {
    render(<FridgeMatchSummary missingIngredients={[]} />);

    expect(screen.getByText("냉장고 재료로 바로 완성")).toBeInTheDocument();
    expect(screen.queryByText(/개만 더/)).not.toBeInTheDocument();
  });

  it("빠진 재료가 있으면 '바로 완성'/'가능' 없이 부족 개수와 빠진 재료 칩만 보인다 (T-02)", () => {
    render(
      <FridgeMatchSummary
        missingIngredients={[{ name: "고추가루" }, { name: "대파" }]}
      />
    );

    expect(screen.getByText("2개만 더")).toBeInTheDocument();
    expect(screen.getByText("고추가루")).toBeInTheDocument();
    expect(screen.getByText("대파")).toBeInTheDocument();
    expect(
      screen.queryByText("냉장고 재료로 바로 완성")
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/가능/)).not.toBeInTheDocument();
  });

  it("빠진 재료가 4개 이상이면 일부만 보이고 펼치고 접을 수 있다 (T-03)", async () => {
    render(
      <FridgeMatchSummary
        missingIngredients={[
          { name: "고추가루" },
          { name: "대파" },
          { name: "마늘" },
          { name: "청양고추" },
          { name: "간장" },
        ]}
      />
    );

    expect(screen.queryByText("청양고추")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("+2"));

    expect(await screen.findByText("청양고추")).toBeInTheDocument();
    expect(screen.getByText("간장")).toBeInTheDocument();

    fireEvent.click(screen.getByText("접기"));

    expect(screen.queryByText("청양고추")).not.toBeInTheDocument();
  });
});
