import { fireEvent, render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { NutritionThemeSelector } from "../NutritionThemeSelector";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const NOOP = () => {};

describe("NutritionThemeSelector i18n", () => {
  it("/ja에서 heading과 대표 테마가 ja 사전값", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(
      <NutritionThemeSelector selectedTheme={null} onThemeSelect={NOOP} />
    );
    expect(
      screen.getByText(taxonomyMessages.ja.filters.themeSection)
    ).toBeInTheDocument();
    expect(
      screen.getByText(taxonomyMessages.ja.nutritionTheme.KETO)
    ).toBeInTheDocument();
    expect(screen.queryByText("식단 테마")).not.toBeInTheDocument();
  });

  it("/ja에서 테마를 눌러도 코드가 전달된다", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    const onSelect = jest.fn();
    render(
      <NutritionThemeSelector selectedTheme={null} onThemeSelect={onSelect} />
    );
    fireEvent.click(screen.getByText(taxonomyMessages.ja.nutritionTheme.KETO));
    expect(onSelect).toHaveBeenCalledWith("KETO");
  });

  it("ko에서 한글 라벨 유지", () => {
    mockPathname.mockReturnValue("/search/results");
    render(
      <NutritionThemeSelector selectedTheme={null} onThemeSelect={NOOP} />
    );
    expect(screen.getByText("식단 테마")).toBeInTheDocument();
    expect(screen.getByText("키토")).toBeInTheDocument();
  });
});
