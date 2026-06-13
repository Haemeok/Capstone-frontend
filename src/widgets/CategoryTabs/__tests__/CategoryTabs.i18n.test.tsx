import { render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

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

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const HANGUL_RANGE = /[가-힣]/;

describe("CategoryTabs i18n (T-04)", () => {
  it("주입된 title을 렌더한다", () => {
    const { usePathname } = jest.requireMock("next/navigation") as {
      usePathname: jest.Mock;
    };
    usePathname.mockReturnValue("/");
    render(<CategoryTabs title="__CATEGORY__" />);
    expect(screen.getByText("__CATEGORY__")).toBeInTheDocument();
  });
});

describe("CategoryTabs i18n (T-10/11/12)", () => {
  it("T-10: /ja 렌더 시 CHEF_RECIPE 칩이 ja 라벨로 표시되고 한글이 없다", () => {
    const { usePathname } = jest.requireMock("next/navigation") as {
      usePathname: jest.Mock;
    };
    usePathname.mockReturnValue("/ja");

    const { container } = render(<CategoryTabs title="Category" />);

    const expectedLabel = taxonomyMessages.ja.tags.CHEF_RECIPE;
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    expect(HANGUL_RANGE.test(container.textContent ?? "")).toBe(false);
  });

  it("T-11: /ja 렌더 시 CHEF_RECIPE 칩 링크가 /ja/recipes/category/CHEF_RECIPE", () => {
    const { usePathname } = jest.requireMock("next/navigation") as {
      usePathname: jest.Mock;
    };
    usePathname.mockReturnValue("/ja");

    render(<CategoryTabs title="カテゴリー" />);

    const expectedLabel = taxonomyMessages.ja.tags.CHEF_RECIPE;
    const chip = screen.getByText(expectedLabel).closest("a");
    expect(chip).not.toBeNull();
    expect(chip?.getAttribute("href")).toBe("/ja/recipes/category/CHEF_RECIPE");
  });

  it("T-12: ko(/) 렌더 시 CHEF_RECIPE 칩이 한글 라벨 + href에 prefix 없음", () => {
    const { usePathname } = jest.requireMock("next/navigation") as {
      usePathname: jest.Mock;
    };
    usePathname.mockReturnValue("/");

    render(<CategoryTabs title="카테고리" />);

    const expectedLabel = taxonomyMessages.ko.tags.CHEF_RECIPE;
    const chip = screen.getByText(expectedLabel).closest("a");
    expect(chip).not.toBeNull();
    expect(chip?.getAttribute("href")).toBe("/recipes/category/CHEF_RECIPE");
  });
});
