import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import SearchDiscoveryDefault from "../SearchDiscoveryDefault";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/features/search-input", () => ({
  SearchInput: () => null,
}));
jest.mock("../ui/SaveButton", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/LatestRecipesSlide", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/ContentPageGrid", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/NutritionThemeSection", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/features/recipe-create/ui/FloatingCreateRecipeButton", () => ({
  __esModule: true,
  default: () => null,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const ko = searchDiscoveryMessages.ko;
const ja = searchDiscoveryMessages.ja;
const en = searchDiscoveryMessages.en;

describe("SearchDiscoveryDefault i18n", () => {
  it("T-01: /ja·/en 경로에서 헤딩이 해당 locale 사전 값", () => {
    setPath("/ja/search");
    const { rerender } = render(<SearchDiscoveryDefault />);
    expect(screen.getByText(ja.contentSectionTitle)).toBeInTheDocument();
    expect(screen.getByText(ja.nutritionSectionTitle)).toBeInTheDocument();

    setPath("/en/search");
    rerender(<SearchDiscoveryDefault />);
    expect(screen.getByText(en.contentSectionTitle)).toBeInTheDocument();
    expect(screen.getByText(en.nutritionSectionTitle)).toBeInTheDocument();
  });

  it("T-02: 루트(ko)에서 ko 헤딩 + 가격대 섹션 존재(회귀)", () => {
    setPath("/search");
    render(<SearchDiscoveryDefault />);
    expect(screen.getByText(ko.contentSectionTitle)).toBeInTheDocument();
    expect(
      screen.getByText("지갑은 가볍게, 식탁은 든든하게")
    ).toBeInTheDocument();
  });

  it("T-03: /ja·/en에서 가격대 섹션이 렌더되지 않음", () => {
    setPath("/ja/search");
    const { rerender } = render(<SearchDiscoveryDefault />);
    expect(
      screen.queryByText("지갑은 가볍게, 식탁은 든든하게")
    ).not.toBeInTheDocument();

    setPath("/en/search");
    rerender(<SearchDiscoveryDefault />);
    expect(
      screen.queryByText("지갑은 가볍게, 식탁은 든든하게")
    ).not.toBeInTheDocument();
  });
});
