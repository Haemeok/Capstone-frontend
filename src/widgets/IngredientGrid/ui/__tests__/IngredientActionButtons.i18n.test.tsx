import { render, screen } from "@testing-library/react";

import { ingredientsMessages } from "@/shared/i18n/ingredientsMessages";

import IngredientActionButtons from "../IngredientActionButtons";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const HANGUL = /[가-힣]/;

describe("IngredientActionButtons i18n", () => {
  it.each([
    ["/ja/ingredients", "ja"] as const,
    ["/en/ingredients", "en"] as const,
  ])("T-07: %s 기본 모드 버튼이 현지 언어로 표시된다", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = ingredientsMessages[loc].actions;
    render(
      <IngredientActionButtons
        isDeleteMode={false}
        setIsDeleteMode={() => {}}
      />
    );
    expect(screen.getByText(m.delete)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: m.addIngredient })
    ).toBeInTheDocument();
  });

  it.each([
    ["/ja/ingredients", "ja"] as const,
    ["/en/ingredients", "en"] as const,
  ])("T-08: %s 삭제 모드 버튼이 현지 언어로 표시된다", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = ingredientsMessages[loc].actions;
    render(
      <IngredientActionButtons
        isDeleteMode={true}
        setIsDeleteMode={() => {}}
        isAllSelected={false}
      />
    );
    expect(screen.getByText(m.selectAll)).toBeInTheDocument();
    expect(screen.getByText(m.done)).toBeInTheDocument();
  });

  it("T-24: /ja에서 재료 추가 링크가 /ja/ingredients/new로 이동한다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(
      <IngredientActionButtons
        isDeleteMode={false}
        setIsDeleteMode={() => {}}
      />
    );
    expect(
      screen.getByRole("link", {
        name: ingredientsMessages.ja.actions.addIngredient,
      })
    ).toHaveAttribute("href", "/ja/ingredients/new");
  });

  it("T-26: ko(/)에서 재료 추가 링크가 prefix 없이 /ingredients/new로 이동한다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(
      <IngredientActionButtons
        isDeleteMode={false}
        setIsDeleteMode={() => {}}
      />
    );
    expect(
      screen.getByRole("link", {
        name: ingredientsMessages.ko.actions.addIngredient,
      })
    ).toHaveAttribute("href", "/ingredients/new");
  });

  it.each([["/ja/ingredients"] as const, ["/en/ingredients"] as const])(
    "T-12: %s 액션 버튼 렌더에 한글이 없다",
    (path) => {
      mockPathname.mockReturnValue(path);
      const { container } = render(
        <IngredientActionButtons
          isDeleteMode={true}
          setIsDeleteMode={() => {}}
        />
      );
      expect(container.textContent ?? "").not.toMatch(HANGUL);
    }
  );
});
