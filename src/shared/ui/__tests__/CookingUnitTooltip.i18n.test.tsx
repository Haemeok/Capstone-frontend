import { fireEvent, render, screen } from "@testing-library/react";

import { cookingUnitsMessages } from "@/shared/i18n/cookingUnitsMessages";

import CookingUnitTooltip from "../CookingUnitTooltip";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

describe("CookingUnitTooltip i18n", () => {
  it("ja에서 trigger와 열린 표가 ja 사전값으로 표시되고 한글이 남지 않는다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new/manual");
    const dict = cookingUnitsMessages.ja;
    const { baseElement } = render(<CookingUnitTooltip />);

    const trigger = screen.getByRole("button", { name: dict.tableTrigger });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByText(dict.conversions[0].unit)).toBeInTheDocument();
    expect(screen.getByText(dict.conversions[0].tip)).toBeInTheDocument();
    expect(HANGUL.test(baseElement.textContent ?? "")).toBe(false);
  });

  it("ko에서는 한글 사전값을 그대로 쓴다", () => {
    mockPathname.mockReturnValue("/recipes/new/manual");
    const dict = cookingUnitsMessages.ko;
    render(<CookingUnitTooltip />);

    expect(
      screen.getByRole("button", { name: dict.tableTrigger })
    ).toBeInTheDocument();
  });
});
