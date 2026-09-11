import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n/format";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { IngredientsFilterSheet } from "../IngredientsFilterSheet";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/entities/ingredient", () => ({
  getIngredients: jest.fn().mockResolvedValue({
    content: [
      { id: "A", name: "양파" },
      { id: "C", name: "감자" },
    ],
    last: true,
  }),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/search",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const initialSelectedIds = ["A", "B"];
const pendingNames: { id: string; name: string }[] = [];
const resolvedNames = [
  { id: "A", name: "양파" },
  { id: "B", name: "당근" },
];
const filters = taxonomyMessages.ko.filters;

const setup = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const onApply = jest.fn();
  const sheet = (ingredientNames = pendingNames, open = true) => (
    <QueryClientProvider client={client}>
      <IngredientsFilterSheet
        ingredientNames={ingredientNames}
        initialSelectedIds={initialSelectedIds}
        open={open}
        onOpenChange={() => {}}
        onApply={onApply}
      />
    </QueryClientProvider>
  );
  const view = render(sheet());
  return {
    onApply,
    update: (names = pendingNames, open = true) =>
      view.rerender(sheet(names, open)),
  };
};

const applySelection = (count: number) => {
  fireEvent.click(
    screen.getByRole("button", {
      name: format(filters.ingredientsApplyButton, { count }),
    })
  );
};

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

it("이름 조회 전에도 확정 선택 ID를 적용한다", () => {
  const { onApply } = setup();
  applySelection(2);
  expect(onApply).toHaveBeenCalledWith(["A", "B"]);
});

it("늦은 이름 응답은 편집 선택을 유지하고 칩 이름만 채운다", async () => {
  const { update, onApply } = setup();
  fireEvent.click(await screen.findByRole("button", { name: "양파" }));
  fireEvent.click(await screen.findByRole("button", { name: "감자" }));
  update(resolvedNames);
  expect(screen.getByText("당근")).toBeInTheDocument();
  expect(screen.getAllByText("감자")).toHaveLength(2);
  update([...resolvedNames]);
  expect(screen.getAllByText("양파")).toHaveLength(1);
  applySelection(2);
  expect(onApply).toHaveBeenCalledWith(["B", "C"]);
});

it("취소 후 다시 열면 편집 선택 대신 확정 선택을 적용한다", async () => {
  const { update, onApply } = setup();
  fireEvent.click(await screen.findByRole("button", { name: "감자" }));
  update(resolvedNames, false);
  update(resolvedNames, true);
  applySelection(2);
  expect(onApply).toHaveBeenCalledWith(["A", "B"]);
});

it("초기화 후 이름 응답이 도착해도 선택은 비어 있다", () => {
  const { update, onApply } = setup();
  fireEvent.click(screen.getByRole("button", { name: filters.reset }));
  update(resolvedNames);
  expect(screen.queryByText("양파")).not.toBeInTheDocument();
  applySelection(0);
  expect(onApply).toHaveBeenCalledWith([]);
});
