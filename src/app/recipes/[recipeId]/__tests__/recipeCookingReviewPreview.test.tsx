/** @jest-environment jsdom */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import { fetchRecipeCookingReviews } from "@/entities/cooking-review/model/api";
import type {
  PublicCookingReview,
  PublicCookingReviewsResponse,
} from "@/entities/cooking-review/model/types";

import { RecipeCookingReviewPreview } from "../_components/RecipeCookingReviewPreview";

jest.mock("@/entities/cooking-review/model/api", () => ({
  fetchMyCookingReviews: jest.fn(),
  fetchRecipeCookingReviews: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({
    alt,
    src,
    wrapperClassName,
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    wrapperClassName?: string;
  }) => <img alt={alt} src={src} className={wrapperClassName} />,
}));

const fetchReviewsMock = jest.mocked(fetchRecipeCookingReviews);

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });

const review = (
  reviewId: string,
  nickname: string,
  content: string,
  imageUrl?: string
): PublicCookingReview => ({
  reviewId,
  nickname,
  profileImageUrl: null,
  content,
  images: imageUrl ? [{ url: imageUrl }] : [],
  createdAt: "2026-08-18T10:00:00+09:00",
  mine: false,
});

const response = (
  totalCount: number,
  items: PublicCookingReview[],
  hasNext = false
): PublicCookingReviewsResponse => ({ totalCount, items, hasNext });

const renderPreview = (queryClient = makeQueryClient()) =>
  render(
    <QueryClientProvider client={queryClient}>
      <RecipeCookingReviewPreview recipeId="recipe-a" />
    </QueryClientProvider>
  );

beforeEach(() => {
  jest.clearAllMocks();
});

it("T-01: 서버 HTML은 후기를 요청하지 않고 클라이언트에서 조회합니다", async () => {
  fetchReviewsMock.mockResolvedValue(response(0, []));
  const queryClient = makeQueryClient();

  expect(RecipeCookingReviewPreview.constructor.name).not.toBe("AsyncFunction");

  renderPreview(queryClient);

  await waitFor(() =>
    expect(fetchReviewsMock).toHaveBeenCalledWith({
      recipeId: "recipe-a",
      page: 0,
      size: 1,
      photoOnly: false,
    })
  );
  expect(fetchReviewsMock).toHaveBeenCalledWith({
    recipeId: "recipe-a",
    page: 0,
    size: 3,
    photoOnly: true,
  });
});

it("T-02: 0건이면 숫자 대신 빈 상태 안내를 표시합니다", async () => {
  fetchReviewsMock.mockResolvedValue(response(0, []));

  renderPreview();

  expect(await screen.findByText("아직 후기가 없어요")).toBeInTheDocument();
  expect(
    screen.getByText("첫 요리 후기를 기다리고 있어요")
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "만들어봤어요 0" })
  ).not.toBeInTheDocument();
});

it("T-03: 후기 개수와 사진 3장, 최신 후기 문장을 표시합니다", async () => {
  fetchReviewsMock.mockImplementation(async ({ photoOnly }) => {
    if (photoOnly) {
      return response(5, [
        review("photo-1", "첫째", "첫 사진", "https://img/1.jpg"),
        review("photo-2", "둘째", "둘째 사진", "https://img/2.jpg"),
        review("photo-3", "셋째", "셋째 사진", "https://img/3.jpg"),
      ]);
    }
    return response(8, [review("latest", "요리왕", "간이 딱 맞아요")]);
  });

  const { container } = renderPreview();

  expect(
    await screen.findByRole("heading", { name: "만들어봤어요 8" })
  ).toBeInTheDocument();
  expect(screen.getByText("간이 딱 맞아요")).toBeInTheDocument();
  expect(container.querySelector('[data-photo-layout="three"]')).not.toBeNull();
  expect(screen.getByText("+2")).toBeInTheDocument();
});

it.each([
  {
    name: "사진 2장은 한 칸을 비운 3열에 표시합니다",
    photos: [
      review("photo-1", "첫째", "첫 사진", "https://img/1.jpg"),
      review("photo-2", "둘째", "둘째 사진", "https://img/2.jpg"),
    ],
    layout: "two",
  },
  {
    name: "사진 1장은 고정 크기로 표시합니다",
    photos: [review("photo-1", "첫째", "첫 사진", "https://img/1.jpg")],
    layout: "one",
  },
])("T-03: $name", async ({ photos, layout }) => {
  fetchReviewsMock.mockImplementation(async ({ photoOnly }) =>
    photoOnly
      ? response(photos.length, photos)
      : response(3, [review("latest", "요리왕", "맛있어요")])
  );

  const { container } = renderPreview();

  await screen.findByText("맛있어요");
  expect(
    container.querySelector(`[data-photo-layout="${layout}"]`)
  ).not.toBeNull();
});

it("T-04: 전체 보기 링크의 강조를 낮춥니다", () => {
  fetchReviewsMock.mockReturnValue(new Promise(() => {}));

  renderPreview();

  expect(screen.getByRole("link", { name: "전체 보기" })).toHaveClass(
    "font-normal",
    "text-ink-muted"
  );
});

it("T-05: 후기 조회 중에는 로딩 자리를 표시합니다", () => {
  fetchReviewsMock.mockReturnValue(new Promise(() => {}));

  renderPreview();

  expect(
    screen.getByRole("status", { name: "후기 불러오는 중" })
  ).toBeInTheDocument();
});

it("T-05: 후기 조회가 실패해도 섹션 헤더를 유지합니다", async () => {
  fetchReviewsMock.mockRejectedValue(new Error("review api failed"));

  renderPreview();

  await waitFor(() => expect(fetchReviewsMock).toHaveBeenCalledTimes(2));
  expect(
    screen.getByRole("heading", { name: "만들어봤어요" })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "전체 보기" })).toBeInTheDocument();
  expect(screen.queryByText("아직 후기가 없어요")).not.toBeInTheDocument();
});
