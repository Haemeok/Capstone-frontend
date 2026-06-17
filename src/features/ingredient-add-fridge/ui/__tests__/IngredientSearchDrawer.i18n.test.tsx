import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import type { IngredientsApiResponse } from "@/entities/ingredient/model/types";

import IngredientSearchDrawer from "../IngredientSearchDrawer";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const getIngredientsMock = jest.fn();
jest.mock("@/entities/ingredient", () => ({
  getIngredients: (p: unknown) => getIngredientsMock(p),
}));
jest.mock("@/features/ingredient-add-fridge/model/hooks", () => ({
  useAddIngredientMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock("@/features/ingredient-delete-fridge", () => ({
  useDeleteIngredientMutation: () => ({ mutate: jest.fn() }),
}));

const page = (
  content: IngredientsApiResponse["content"]
): IngredientsApiResponse => ({
  content,
  page: { size: 20, number: 0, totalElements: content.length, totalPages: 1 },
});

const renderDrawer = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <IngredientSearchDrawer open onOpenChange={() => {}} />
    </QueryClientProvider>
  );

const hangul = /[가-힣]/;

beforeEach(() => getIngredientsMock.mockReset());

describe("IngredientSearchDrawer i18n", () => {
  it.each(["ja", "en"] as const)(
    "%s 드로어 chrome에 한글 0 + 추가 버튼 현지화 (T-04/T-05)",
    async (loc) => {
      mockPathname.mockReturnValue(`/${loc}/ingredients/new`);
      getIngredientsMock.mockResolvedValue(
        page([
          {
            id: "x",
            name: "tomato",
            imageUrl: "",
            inFridge: false,
          } as IngredientsApiResponse["content"][number],
        ])
      );
      const { container } = renderDrawer();
      expect(
        await screen.findByText(ingredientAddMessages[loc].add)
      ).toBeInTheDocument();
      expect(hangul.test(container.textContent ?? "")).toBe(false);
    }
  );

  it("ja 카테고리 칩이 택소노미로 현지화된다, 전체 칩 라벨 (T-06)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    getIngredientsMock.mockResolvedValue(page([]));
    renderDrawer();
    expect(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.ALL,
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "전체" })).toBeNull();
  });

  it("ja 결과 0건이면 noResults에 query가 치환된다 (T-07)", async () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    getIngredientsMock.mockResolvedValue(page([]));
    renderDrawer();
    const input = screen.getByPlaceholderText(
      ingredientAddMessages.ja.searchPlaceholder
    );
    const query = "no-such-ingredient-xyz";
    fireEvent.change(input, { target: { value: query } });
    fireEvent.submit(input.closest("form")!);
    expect(await screen.findByText(new RegExp(query))).toBeInTheDocument();
  });

  it("ja 페치 에러 시 에러 문구가 현지어(한글 0) (T-08)", async () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    getIngredientsMock.mockRejectedValue(new Error("boom"));
    const { container } = renderDrawer();
    await screen.findByText(/エラー/);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
  });

  it("ko 드로어는 한글 canonical 유지 (T-09)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    getIngredientsMock.mockResolvedValue(page([]));
    renderDrawer();
    expect(
      screen.getByText(ingredientAddMessages.ko.drawerDescription)
    ).toBeInTheDocument();
    expect(
      screen.getByText(ingredientAddMessages.ko.close)
    ).toBeInTheDocument();
  });
});
