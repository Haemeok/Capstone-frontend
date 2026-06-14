import { render, screen } from "@testing-library/react";

import { INGREDIENT_PACKS } from "@/shared/config/constants/ingredientPacks";
import { format } from "@/shared/i18n";
import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";

import IngredientPackDetailDrawer from "../IngredientPackDetailDrawer";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const packA = INGREDIENT_PACKS[0];
const hangul = /[가-힣]/;

const renderDrawer = (owned: Set<string> = new Set()) =>
  render(
    <IngredientPackDetailDrawer
      pack={packA}
      open
      onOpenChange={() => {}}
      onAddSelected={() => {}}
      onDeleteSelected={() => {}}
      ownedIngredientIds={owned}
    />
  );

describe("IngredientPackDetailDrawer i18n", () => {
  it.each(["ja", "en"] as const)(
    "%s 팩 상세 전체 렌더에 한글 0 (재료명 누락 포착) (T-16/T-17)",
    (loc) => {
      mockPathname.mockReturnValue(`/${loc}/ingredients/new`);
      const { baseElement } = renderDrawer();
      expect(hangul.test(baseElement.textContent ?? "")).toBe(false);
    }
  );

  it.each(
    INGREDIENT_PACKS.flatMap((_p, i) =>
      (["ja", "en"] as const).map((loc) => [loc, i] as const)
    )
  )("%s pack[%i] 상세 한글 0", (loc, i) => {
    mockPathname.mockReturnValue(`/${loc}/ingredients/new`);
    const { baseElement } = render(
      <IngredientPackDetailDrawer
        pack={INGREDIENT_PACKS[i]}
        open
        onOpenChange={() => {}}
        onAddSelected={() => {}}
        onDeleteSelected={() => {}}
        ownedIngredientIds={new Set()}
      />
    );
    expect(hangul.test(baseElement.textContent ?? "")).toBe(false);
  });

  it("ja 헤더 총 개수 접미가 치환되어 표시 (T-18)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    renderDrawer();
    expect(
      screen.getByText((t) =>
        t.includes(
          format(ingredientAddMessages.ja.packCountLabel, {
            count: packA.ingredients.length,
          })
        )
      )
    ).toBeInTheDocument();
  });

  it("ja 제출 CTA가 선택 개수로 치환된 현지어 (T-19)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    const common = {
      pack: packA,
      onOpenChange: () => {},
      onAddSelected: () => {},
      onDeleteSelected: () => {},
      ownedIngredientIds: new Set<string>(),
    };
    const utils = render(
      <IngredientPackDetailDrawer {...common} open={false} />
    );
    utils.rerender(<IngredientPackDetailDrawer {...common} open />);
    expect(
      screen.getByRole("button", {
        name: format(ingredientAddMessages.ja.addCount, {
          count: packA.ingredients.length,
        }),
      })
    ).toBeInTheDocument();
  });

  it("ko 드로어는 한글 재료명/chrome 유지 (T-20)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    renderDrawer();
    expect(
      screen.getByText(ingredientAddMessages.ko.selectAll)
    ).toBeInTheDocument();
    expect(screen.getByText(packA.ingredients[0].name)).toBeInTheDocument();
  });
});
