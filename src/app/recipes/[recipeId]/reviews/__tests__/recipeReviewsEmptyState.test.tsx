/** @jest-environment jsdom */

import {
  type InfiniteData,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { COOKING_REVIEW_QUERY_KEYS } from "@/entities/cooking-review/model/queryKeys";
import type { PublicCookingReviewsResponse } from "@/entities/cooking-review/model/types";

import { RecipeReviewsPageClient } from "../_components/RecipeReviewsPageClient";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/ui/PrevButton", () => ({
  __esModule: true,
  default: () => <button type="button">뒤로</button>,
}));

jest.mock("../_components/FirstCookingReviewCta", () => ({
  FirstCookingReviewCta: () => (
    <button type="button">첫 번째 요리 후기 남기기</button>
  ),
}));

it("T-12: 전체 후기가 0건이면 첫 후기 CTA와 disabled 사진 필터가 보인다", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  const emptyData: InfiniteData<PublicCookingReviewsResponse, number> = {
    pages: [{ totalCount: 0, items: [], hasNext: false }],
    pageParams: [0],
  };
  queryClient.setQueryData(
    COOKING_REVIEW_QUERY_KEYS.publicList("recipe-a", false, 20),
    emptyData
  );

  render(
    <QueryClientProvider client={queryClient}>
      <RecipeReviewsPageClient
        recipeId="recipe-a"
        recipeTitle="정호영 냉우동"
        recipeImageUrl="/cold-udon.webp"
        saveAmount={5300}
      />
    </QueryClientProvider>
  );

  expect(
    screen.getByRole("button", { name: "첫 번째 요리 후기 남기기" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "사진 리뷰만 보기" })
  ).toBeDisabled();
});
