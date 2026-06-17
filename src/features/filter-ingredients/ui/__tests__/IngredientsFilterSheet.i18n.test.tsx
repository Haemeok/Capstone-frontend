import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n/format";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/entities/ingredient", () => ({
  getIngredients: jest.fn().mockResolvedValue({ content: [] }),
}));
const pathnameMock = jest.fn(() => "/ja/search");
jest.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

import { IngredientsFilterSheet } from "../IngredientsFilterSheet";

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const renderSheet = (initial = [] as { id: string; name: string }[]) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <IngredientsFilterSheet
        open
        onOpenChange={() => {}}
        initialIngredients={initial}
        onApply={() => {}}
      />
    </QueryClientProvider>
  );
};

const jaFilters = taxonomyMessages.ja.filters;
const koFilters = taxonomyMessages.ko.filters;

it("T-05: ja 경로에서 타이틀/placeholder가 ja로 렌더된다", async () => {
  renderSheet();
  expect(
    await screen.findByText(jaFilters.ingredientsTitle)
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(jaFilters.ingredientsSearchPlaceholder)
  ).toBeInTheDocument();
  expect(
    screen.queryByText(koFilters.ingredientsTitle)
  ).not.toBeInTheDocument();
});

it("T-07: 선택 2개면 적용 버튼이 ja이고 {count}=2로 치환된다", async () => {
  renderSheet([
    { id: "i1", name: "玉ねぎ" },
    { id: "i2", name: "豆腐" },
  ]);
  expect(
    await screen.findByText(
      format(jaFilters.ingredientsApplyButton, { count: 2 })
    )
  ).toBeInTheDocument();
});

it("T-09: ko 경로에서는 기존 한글이 그대로다(회귀)", async () => {
  pathnameMock.mockReturnValue("/search");
  renderSheet();
  expect(
    await screen.findByText(koFilters.ingredientsTitle)
  ).toBeInTheDocument();
  pathnameMock.mockReturnValue("/ja/search");
});
