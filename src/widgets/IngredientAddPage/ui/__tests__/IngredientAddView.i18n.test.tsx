import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";

import { IngredientAddView } from "../IngredientAddView";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock("@/shared/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));
jest.mock("@/entities/ingredient", () => ({
  useMyIngredientIds: () => ({ ingredientIdsSet: new Set<string>() }),
}));
jest.mock("@/features/ingredient-add-fridge", () => ({
  useAddIngredientBulkMutation: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock("@/features/ingredient-delete-fridge", () => ({
  useDeleteIngredientBulkMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useDeleteIngredientMutation: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock("@/features/ingredient-add-fridge/ui/IngredientSearchDrawer", () => ({
  __esModule: true,
  default: () => null,
}));

const renderView = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <IngredientAddView />
    </QueryClientProvider>
  );

describe("IngredientAddView i18n", () => {
  it("ko에서 페이지 chrome가 한글 canonical로 표시된다 (T-03)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    renderView();
    expect(
      screen.getByRole("heading", { name: ingredientAddMessages.ko.pageTitle })
    ).toBeInTheDocument();
    expect(
      screen.getByText(ingredientAddMessages.ko.packsHeading)
    ).toBeInTheDocument();
    expect(
      screen.getByText(ingredientAddMessages.ko.packsSubtitle)
    ).toBeInTheDocument();
  });

  it.each([
    ["/ja/ingredients/new", "ja"] as const,
    ["/en/ingredients/new", "en"] as const,
  ])(
    "%s 에서 페이지 chrome가 현지 언어로 표시된다 (T-01/T-02)",
    (path, loc) => {
      mockPathname.mockReturnValue(path);
      const m = ingredientAddMessages[loc];
      renderView();
      expect(
        screen.getByRole("heading", { name: m.pageTitle })
      ).toBeInTheDocument();
      expect(screen.getByText(m.packsHeading)).toBeInTheDocument();
      expect(screen.getByText(m.packsSubtitle)).toBeInTheDocument();
      expect(screen.getByLabelText(m.searchEntryAria)).toBeInTheDocument();
      expect(screen.queryByText("추천 재료 모음")).not.toBeInTheDocument();
    }
  );
});
