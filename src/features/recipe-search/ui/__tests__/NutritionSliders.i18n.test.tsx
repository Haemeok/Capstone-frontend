import { render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";
import type { NutritionFilterValues } from "@/shared/lib/nutrition/utils";

import { NutritionSliders } from "../NutritionSliders";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const BASE_VALUES: NutritionFilterValues = {};
const NOOP = () => {};

describe("NutritionSliders i18n", () => {
  it("T-08: /ja 슬라이더에 cost(재료비) 부재, calories 존재", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(<NutritionSliders values={BASE_VALUES} onValueChange={NOOP} />);

    expect(
      screen.getByText(taxonomyMessages.ja.nutritionLabel.calories)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(taxonomyMessages.ja.nutritionLabel.cost)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("재료비")).not.toBeInTheDocument();
  });

  it("T-08: /en 슬라이더에 cost 부재, calories 존재", () => {
    mockPathname.mockReturnValue("/en/search/results");
    render(<NutritionSliders values={BASE_VALUES} onValueChange={NOOP} />);

    expect(
      screen.getByText(taxonomyMessages.en.nutritionLabel.calories)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(taxonomyMessages.en.nutritionLabel.cost)
    ).not.toBeInTheDocument();
  });

  it("T-08b: ko 슬라이더에 재료비 존재", () => {
    mockPathname.mockReturnValue("/search/results");
    render(<NutritionSliders values={BASE_VALUES} onValueChange={NOOP} />);

    expect(screen.getByText("재료비")).toBeInTheDocument();
    expect(screen.getByText("칼로리")).toBeInTheDocument();
  });
});
