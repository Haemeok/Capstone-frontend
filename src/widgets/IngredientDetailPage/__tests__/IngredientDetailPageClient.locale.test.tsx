import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import type { IngredientDetailView } from "@/entities/ingredient";

import IngredientDetailPageClient from "../IngredientDetailPageClient";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => "/",
}));

const detail: IngredientDetailView = {
  id: "ing1",
  name: "양파",
  imageUrl: null,
  categoryLabel: null,
  storage: {
    location: "냉장",
    temperature: "4도",
    duration: "2주",
    notes: "건조하게",
  },
  pairings: {
    good: [
      { id: "ing2", name: "마늘", imageUrl: "https://example.com/garlic.jpg" },
    ],
    bad: [],
  },
  cookingMethods: ["볶음"],
  coupangLink: "https://coupang.test/x",
  nutrition: { kcal: 40, proteinG: 1, carbohydrateG: 9, fatG: 0 },
  seasonMonths: [3, 4],
  benefits: "면역",
};

const renderClient = (locale: "ko" | "ja" | "en") => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <IngredientDetailPageClient detail={detail} locale={locale} />
    </QueryClientProvider>
  );
};

const KO_CHROME = [
  "영양정보",
  "효능",
  "궁합 재료",
  "보관방법",
  "제철",
  "추천 조리법",
];

it("T-10: ja 렌더에 ko chrome 문자열이 남지 않는다", () => {
  const { container } = renderClient("ja");
  for (const s of KO_CHROME) expect(container.textContent).not.toContain(s);
});

it("T-11: en 렌더에 ko chrome 문자열이 남지 않는다 (en 회귀가드)", () => {
  const { container } = renderClient("en");
  for (const s of KO_CHROME) expect(container.textContent).not.toContain(s);
});

it("T-10(앵커): ko 렌더엔 chrome 문자열이 그대로 있다 (ko 무회귀)", () => {
  const { container } = renderClient("ko");
  for (const s of KO_CHROME) expect(container.textContent).toContain(s);
});

it("T-13: ja에선 쿠팡 카드가 렌더되지 않는다", () => {
  const { queryByTestId } = renderClient("ja");
  expect(queryByTestId("coupang-card")).toBeNull();
});

it("T-13(앵커): ko에선 쿠팡 카드가 렌더된다", () => {
  const { queryByTestId } = renderClient("ko");
  expect(queryByTestId("coupang-card")).not.toBeNull();
});
