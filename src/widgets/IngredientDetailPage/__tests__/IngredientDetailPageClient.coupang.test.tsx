import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import type { IngredientDetailView } from "@/entities/ingredient";

import IngredientDetailPageClient from "../IngredientDetailPageClient";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("../IngredientRecipesSlide", () => () => null);

jest.mock("@/shared/coupang", () => ({
  CoupangProductSlide: ({
    cards,
  }: {
    cards: Array<{ product: { name: string } }>;
  }) => (
    <ul>
      {cards.map((c) => (
        <li key={c.product.name}>{c.product.name}</li>
      ))}
    </ul>
  ),
}));

const makeProduct = (name: string) => ({
  rank: 1,
  name,
  price: 1000,
  imageUrl: "https://img",
  url: "https://link",
  categoryName: "식품",
  rocket: false,
  freeShipping: false,
});

const baseDetail: IngredientDetailView = {
  id: "ing1",
  name: "양파",
  imageUrl: null,
  categoryLabel: null,
  storage: { location: null, temperature: null, duration: null, notes: null },
  pairings: { good: [], bad: [] },
  cookingMethods: [],
  coupangLink: null,
  coupang: null,
  nutrition: null,
  seasonMonths: [],
  benefits: null,
};

const renderClient = (detail: IngredientDetailView) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <IngredientDetailPageClient detail={detail} locale="ko" />
    </QueryClientProvider>
  );
};

it("T-27: coupang.products가 있으면 상품명이 렌더된다", () => {
  const detail = {
    ...baseDetail,
    coupang: {
      landingUrl: "https://land",
      lastCollectedAt: "2026-07-04T12:30:00+09:00",
      products: [makeProduct("사과"), makeProduct("배")],
    },
  };
  renderClient(detail);
  expect(screen.getByText("사과")).toBeInTheDocument();
  expect(screen.getByText("배")).toBeInTheDocument();
});

it("T-28: coupang.products가 있을 때 data-testid=coupang-card는 없다", () => {
  const detail = {
    ...baseDetail,
    coupang: {
      landingUrl: "https://land",
      lastCollectedAt: "2026-07-04T12:30:00+09:00",
      products: [makeProduct("사과"), makeProduct("배")],
    },
  };
  const { queryByTestId } = renderClient(detail);
  expect(queryByTestId("coupang-card")).toBeNull();
});

it("T-29: coupang이 null이면 상품 슬라이드가 렌더되지 않는다", () => {
  renderClient(baseDetail);
  expect(screen.queryByText(/쿠팡 파트너스/)).not.toBeInTheDocument();
});
