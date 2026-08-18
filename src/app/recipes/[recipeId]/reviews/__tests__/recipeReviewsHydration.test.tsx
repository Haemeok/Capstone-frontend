/** @jest-environment jsdom */

import {
  type InfiniteData,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { fetchRecipeCookingReviews } from "@/entities/cooking-review/model/api";
import { COOKING_REVIEW_QUERY_KEYS } from "@/entities/cooking-review/model/queryKeys";
import type { PublicCookingReviewsResponse } from "@/entities/cooking-review/model/types";

import { RecipeReviewsPageClient } from "../_components/RecipeReviewsPageClient";
import { makePhotoReviewPage, makeReviewPage } from "./reviewTestFixtures";

let inView = false;

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView }),
}));

jest.mock("@/entities/cooking-review/model/api", () => ({
  fetchMyCookingReviews: jest.fn(),
  fetchRecipeCookingReviews: jest.fn(),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/ui/PrevButton", () => ({
  __esModule: true,
  default: () => <button type="button">뒤로</button>,
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt, src }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={alt} src={src} />
  ),
}));

const fetchReviewsMock = jest.mocked(fetchRecipeCookingReviews);
const triggerHapticMock = jest.mocked(triggerHaptic);

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

const seedReviews = (
  queryClient: QueryClient,
  response: PublicCookingReviewsResponse,
  photoOnly = false
) => {
  const data: InfiniteData<PublicCookingReviewsResponse, number> = {
    pages: [response],
    pageParams: [0],
  };

  queryClient.setQueryData(
    COOKING_REVIEW_QUERY_KEYS.publicList("recipe-a", photoOnly, 20),
    data
  );
};

const renderPage = (queryClient: QueryClient) =>
  render(
    <QueryClientProvider client={queryClient}>
      <RecipeReviewsPageClient
        recipeId="recipe-a"
        recipeTitle="정호영 냉우동"
        recipeImageUrl="https://example.com/recipe.jpg"
        saveAmount={3000}
      />
    </QueryClientProvider>
  );

beforeEach(() => {
  inView = false;
  jest.clearAllMocks();
});

it("T-07: SSR 첫 페이지 캐시가 있으면 hydration 직후 같은 요청을 보내지 않는다", async () => {
  const queryClient = makeQueryClient();
  seedReviews(queryClient, makeReviewPage(20, 23, true));

  renderPage(queryClient);

  expect(screen.getByText("전체 23개")).toBeInTheDocument();
  expect(screen.getByText("후기 01")).toBeInTheDocument();
  await waitFor(() => expect(fetchReviewsMock).not.toHaveBeenCalled());
});

it("T-08~T-10: 사진 칩은 Material 아이콘과 선택 상태를 표시하고 캐시를 재사용한다", async () => {
  const queryClient = makeQueryClient();
  seedReviews(queryClient, makeReviewPage(2, 2, false));
  fetchReviewsMock.mockResolvedValue(makePhotoReviewPage(1));

  renderPage(queryClient);

  const chip = screen.getByRole("button", { name: "사진 리뷰만 보기" });
  const iconPath = chip.querySelector("path");

  expect(chip).toHaveAttribute("aria-pressed", "false");
  expect(chip).not.toHaveClass("bg-ink");
  expect(chip.querySelector("svg")).toHaveAttribute("width", "16");
  expect(iconPath).toHaveAttribute(
    "d",
    "M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
  );

  fireEvent.click(chip);

  await waitFor(() => expect(screen.getByText("후기 01")).toBeInTheDocument());
  expect(chip).toHaveAttribute("aria-pressed", "true");
  expect(chip).toHaveClass("bg-ink", "text-white");
  expect(fetchReviewsMock).toHaveBeenCalledWith({
    recipeId: "recipe-a",
    page: 0,
    size: 20,
    photoOnly: true,
  });
  expect(triggerHapticMock).toHaveBeenCalledWith("Light");

  fireEvent.click(chip);

  expect(chip).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByText("전체 2개")).toBeInTheDocument();
  expect(fetchReviewsMock).toHaveBeenCalledTimes(1);
  expect(triggerHapticMock).toHaveBeenCalledTimes(2);
});

it("T-08: 사진 후기가 0건이면 전체 후기 없음과 다른 안내를 표시한다", async () => {
  const queryClient = makeQueryClient();
  seedReviews(queryClient, makeReviewPage(2, 2, false));
  fetchReviewsMock.mockResolvedValue(makePhotoReviewPage(0));

  renderPage(queryClient);
  fireEvent.click(screen.getByRole("button", { name: "사진 리뷰만 보기" }));

  expect(
    await screen.findByText("사진 후기가 아직 없어요")
  ).toBeInTheDocument();
  expect(
    screen.getByText("필터를 끄면 전체 후기를 볼 수 있어요")
  ).toBeInTheDocument();
});

it("T-09: 전체 후기가 없어서 칩이 비활성화되면 햅틱을 호출하지 않는다", () => {
  const queryClient = makeQueryClient();
  seedReviews(queryClient, makeReviewPage(0, 0, false));

  renderPage(queryClient);
  const chip = screen.getByRole("button", { name: "사진 리뷰만 보기" });

  expect(chip).toBeDisabled();
  fireEvent.click(chip);
  expect(triggerHapticMock).not.toHaveBeenCalled();
});

it("T-11: 다음 페이지가 있으면 스크롤 감지 시 기존 목록 뒤에 붙인다", async () => {
  const queryClient = makeQueryClient();
  seedReviews(queryClient, makeReviewPage(20, 21, true));
  fetchReviewsMock.mockResolvedValue(makeReviewPage(1, 21, false, 21));

  const { rerender } = renderPage(queryClient);
  inView = true;
  rerender(
    <QueryClientProvider client={queryClient}>
      <RecipeReviewsPageClient
        recipeId="recipe-a"
        recipeTitle="정호영 냉우동"
        recipeImageUrl="https://example.com/recipe.jpg"
        saveAmount={3000}
      />
    </QueryClientProvider>
  );

  expect(await screen.findByText("후기 21")).toBeInTheDocument();
  expect(fetchReviewsMock).toHaveBeenCalledWith({
    recipeId: "recipe-a",
    page: 1,
    size: 20,
    photoOnly: false,
  });
  expect(screen.getByText("후기 20")).toBeInTheDocument();
});
