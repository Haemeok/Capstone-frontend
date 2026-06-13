import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { NUTRITION_THEMES } from "@/shared/config/constants/recipe";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import NutritionThemeSection from "../NutritionThemeSection";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/ui/image/Image", () => ({ Image: () => null }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const firstKey = Object.keys(
  NUTRITION_THEMES
)[0] as keyof typeof NUTRITION_THEMES;

it("T-11: /ja에서 첫 테마 label이 ja 사전 값", () => {
  setPath("/ja/search");
  render(<NutritionThemeSection />);
  expect(
    screen.getByText(searchDiscoveryMessages.ja.nutritionThemes[firstKey].label)
  ).toBeInTheDocument();
});

it("T-12: NUTRITION_THEMES 상수 label은 여전히 ko (공유 소비자 무영향)", () => {
  expect(NUTRITION_THEMES[firstKey].label).toBe(
    searchDiscoveryMessages.ko.nutritionThemes[firstKey].label
  );
});
