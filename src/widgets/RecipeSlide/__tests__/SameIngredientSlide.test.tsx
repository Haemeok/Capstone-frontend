import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock("@/shared/api/client", () => ({
  api: {
    get: (...a: unknown[]) => mockGet(...a),
    post: (...a: unknown[]) => mockPost(...a),
  },
}));
let mockInView = true;
jest.mock("@/shared/hooks/useInViewOnce", () => ({
  useInViewOnce: () => ({ ref: { current: null }, inView: mockInView }),
}));
jest.mock("@/shared/i18n", () => ({
  ...jest.requireActual("@/shared/i18n"),
  useT: () => ({
    recipeDetail: {
      sameIngredientTitle:
        "{ingredientName}{particle} 만든 다른 레시피를 찾고 있으세요?",
      remixBadge: "리믹스",
    },
  }),
  format: (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? "")),
}));
jest.mock("@/shared/i18n/useSearchDiscoveryDict", () => ({
  useSearchDiscoveryDict: () => ({
    recipeSlideViewMore: "더보기",
    recipeSlideError: "에러",
    recipeSlideEmpty: "비어있음",
    remixBadge: "리믹스",
  }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import SameIngredientSlide from "../SameIngredientSlide";

const card = (id: string, title: string) => ({
  id,
  title,
  imageUrl: "",
  authorName: "a",
  authorId: "a1",
  profileImage: "",
  createdAt: "2026-01-01T00:00:00",
  avgRating: 0,
  ratingCount: 0,
  tags: [],
});
const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};
beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  mockPost.mockResolvedValue({});
  mockInView = true;
});

describe("SameIngredientSlide", () => {
  it("ingredientName 있으면 보간 타이틀을 보여준다 (T-E1)", async () => {
    mockGet.mockResolvedValue({
      ingredientName: "새우",
      content: [card("r1", "새우볶음")],
    });
    renderWithClient(<SameIngredientSlide recipeId="base1" locale="ko" />);
    expect(
      await screen.findByText("새우로 만든 다른 레시피를 찾고 있으세요?")
    ).toBeInTheDocument();
  });

  it("뷰포트 밖이면 fetch하지 않는다 (T-E2)", async () => {
    mockInView = false;
    renderWithClient(<SameIngredientSlide recipeId="base1" locale="ko" />);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("ingredientName null이면 숨긴다 (T-E3)", async () => {
    mockGet.mockResolvedValue({ ingredientName: null, content: [] });
    renderWithClient(<SameIngredientSlide recipeId="base1" locale="ko" />);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    expect(screen.queryByText(/찾고 있으세요/)).not.toBeInTheDocument();
  });

  it("404/403 에러면 조용히 숨긴다 (T-E4)", async () => {
    mockGet.mockRejectedValue(new Error("404"));
    renderWithClient(<SameIngredientSlide recipeId="base1" locale="ko" />);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    expect(screen.queryByText(/찾고 있으세요/)).not.toBeInTheDocument();
    expect(screen.queryByText("에러")).not.toBeInTheDocument();
  });
});
