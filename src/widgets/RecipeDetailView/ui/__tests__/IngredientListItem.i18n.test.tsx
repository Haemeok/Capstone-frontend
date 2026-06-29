import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

import type { IngredientItem } from "@/entities/ingredient";

import { IngredientListItem } from "../IngredientListItem";

// `as` permitted: 테스트 픽스처는 컴포넌트가 읽는 필드(name/inFridge/coupangLink)만 채운다
const ingredient = {
  id: "i1",
  name: "양파",
  inFridge: false,
  coupangLink: "https://link.coupang.com/x",
  calories: 0,
} as IngredientItem;

const baseProps = {
  ingredient,
  displayAmount: "1개",
  displayPrice: "800원",
  reserveFridgeSpace: false,
};

describe("IngredientListItem i18n layout", () => {
  it("T-C2: ko -> displayAmount + 가격·쿠팡 링크 (4컬럼)", () => {
    render(<IngredientListItem {...baseProps} locale="ko" />);
    expect(screen.getByText("1개")).toBeInTheDocument();
    expect(screen.getByText("800원")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://link.coupang.com/x"
    );
  });

  it("T-C1: en -> displayAmount 렌더, 가격·쿠팡 미렌더, justify-between", () => {
    render(
      <IngredientListItem {...baseProps} displayAmount="3 tbsp" locale="en" />
    );
    expect(screen.getByText("3 tbsp")).toBeInTheDocument();
    expect(screen.queryByText("800원")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("양파").closest("li")).toHaveClass(
      "justify-between"
    );
  });
});
