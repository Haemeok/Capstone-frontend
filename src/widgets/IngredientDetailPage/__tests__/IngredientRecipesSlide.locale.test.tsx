import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import IngredientRecipesSlide from "../IngredientRecipesSlide";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

const baseRecipe = {
  id: "r1",
  title: "炒め",
  imageUrl: null,
  authorName: "テスト",
  authorId: "u1",
  profileImage: "",
  createdAt: "2024-01-01",
  favoriteByCurrentUser: false,
  avgRating: 0,
  ratingCount: 0,
};

const renderSlide = (locale: "ko" | "ja" | "en") => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  qc.setQueryData(
    locale === "ko"
      ? ["recipes", "by-ingredient", "ing1"]
      : ["recipes", "by-ingredient", "ing1", locale],
    { content: [baseRecipe] }
  );
  return render(
    <QueryClientProvider client={qc}>
      <IngredientRecipesSlide
        ingredientId="ing1"
        ingredientName="양파"
        locale={locale}
      />
    </QueryClientProvider>
  );
};

it("T-12: ja 헤드라인에 한국어 조사 템플릿이 없다", () => {
  const { container } = renderSlide("ja");
  expect(container.textContent).toContain("人気レシピ");
  expect(container.textContent).not.toContain("로 만든 인기");
});

it("T-12(앵커): ko 헤드라인은 (으)로 조사 로직을 유지한다", () => {
  const { container } = renderSlide("ko");
  expect(container.textContent).toContain("양파로 만든 인기 레시피");
});

it("T-40: ja 카드 href가 /ja/recipes로 시작한다", () => {
  const { container } = renderSlide("ja");
  const link = container.querySelector("a[href*='/recipes/r1']");
  expect(link?.getAttribute("href")).toMatch(/^\/ja\/recipes\//);
});

it("T-40(앵커): ko 카드 href는 /recipes 루트다", () => {
  const { container } = renderSlide("ko");
  const link = container.querySelector("a[href*='/recipes/r1']");
  expect(link?.getAttribute("href")).toMatch(/^\/recipes\//);
});
