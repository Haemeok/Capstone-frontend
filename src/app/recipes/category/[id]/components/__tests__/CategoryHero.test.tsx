import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

import CategoryHero from "../CategoryHero";

describe("CategoryHero", () => {
  it("대표 이미지와 카테고리명을 표시한다 (T-01)", () => {
    render(<CategoryHero tagCode="QUICK" />);
    expect(screen.getByText("초스피드 / 간단 요리")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toContain("categories/quick.webp");
  });

  it("알 수 없는 카테고리여도 깨지지 않고 코드를 표시한다 (T-02)", () => {
    render(<CategoryHero tagCode={"UNKNOWN_XYZ" as never} />);
    expect(screen.getByText("UNKNOWN_XYZ")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
