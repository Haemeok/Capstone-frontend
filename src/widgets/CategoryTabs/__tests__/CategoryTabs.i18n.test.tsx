import { render, screen } from "@testing-library/react";

import CategoryTabs from "../index";

const emblaApi = {
  selectedScrollSnap: () => 0,
  scrollSnapList: () => [],
  scrollNext: jest.fn(),
  scrollPrev: jest.fn(),
  canScrollPrev: () => false,
  canScrollNext: () => false,
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: () => [jest.fn(), emblaApi],
}));

describe("CategoryTabs i18n (T-04)", () => {
  it("주입된 title을 렌더한다", () => {
    render(<CategoryTabs title="__CATEGORY__" />);
    expect(screen.getByText("__CATEGORY__")).toBeInTheDocument();
  });
});
