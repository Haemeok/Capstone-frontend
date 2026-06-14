import { render, screen } from "@testing-library/react";

import { format, localizePack } from "@/shared/i18n";
import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";

import IngredientPackCard from "../IngredientPackCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const pack = {
  name: "한식 기본 베이스",
  description: "한식 요리를 위한 필수 조미료와 재료",
  ingredients: [
    { id: "a", name: "국간장", imageUrl: "" },
    { id: "b", name: "고추장", imageUrl: "" },
  ],
};

const renderCard = (owned: Set<string>) =>
  render(
    <IngredientPackCard
      pack={pack}
      onViewDetail={() => {}}
      ownedIngredientIds={owned}
    />
  );

const hangul = /[가-힣]/;

describe("IngredientPackCard i18n", () => {
  it("ja 카드 이름/설명이 오버레이 현지값, 카드 한글 0 (T-11)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    const { container } = renderCard(new Set());
    const meta = localizePack(pack, "ja");
    expect(screen.getByText(meta.name)).toBeInTheDocument();
    expect(screen.getByText(meta.description)).toBeInTheDocument();
    expect(hangul.test(container.textContent ?? "")).toBe(false);
  });

  it("ja 재료 카운트가 치환 표시 (T-12)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    renderCard(new Set());
    expect(
      screen.getByText(format(ingredientAddMessages.ja.cardCount, { count: 2 }))
    ).toBeInTheDocument();
  });

  it("ja 전부 보유 시 보유 배지 현지어 (T-13)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    renderCard(new Set(["a", "b"]));
    expect(
      screen.getByText(ingredientAddMessages.ja.cardOwned)
    ).toBeInTheDocument();
  });

  it("ko 카드는 한글 팩명 + aria 유지 (T-14)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    renderCard(new Set());
    expect(screen.getByText("한식 기본 베이스")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /한식 기본 베이스 상세 보기/ })
    ).toBeInTheDocument();
  });
});
