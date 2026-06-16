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
  displayQuantity: "1",
  displayUnit: "개",
  displayPrice: "800원",
  reserveFridgeSpace: false,
};

describe("IngredientListItem i18n layout", () => {
  it("T-A1: ko -> 가격·쿠팡 링크 렌더 (4컬럼 유지)", () => {
    render(<IngredientListItem {...baseProps} locale="ko" />);
    expect(screen.getByText("800원")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://link.coupang.com/x"
    );
  });

  it("T-A2: en -> 가격·쿠팡 미렌더, 이름만, justify-between", () => {
    render(<IngredientListItem {...baseProps} locale="en" />);
    expect(screen.queryByText("800원")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("양파")).toBeInTheDocument();
    expect(screen.getByText("양파").closest("li")).toHaveClass(
      "justify-between"
    );
  });
});
