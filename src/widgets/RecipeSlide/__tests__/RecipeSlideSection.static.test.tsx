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
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import RecipeSlideSection from "../RecipeSlideSection";

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
});

describe("RecipeSlideSection (정적 즉시 렌더)", () => {
  it("status 쿼리가 pending이어도 카드를 즉시 렌더한다 (T-S0-1)", () => {
    mockPost.mockReturnValue(new Promise(() => {}));
    renderWithClient(
      <RecipeSlideSection
        title="인기 레시피"
        recipes={[card("r1", "된장찌개"), card("r2", "김밥")]}
        isLoading={false}
        error={null}
        locale="ko"
      />
    );
    expect(screen.getByText("된장찌개")).toBeInTheDocument();
    expect(screen.getByText("김밥")).toBeInTheDocument();
  });

  it("status resolve 후 카드가 유지된 채 즐겨찾기 조회가 일어난다 (T-S0-2)", async () => {
    mockPost.mockResolvedValue({ r1: { favoriteByCurrentUser: true } });
    renderWithClient(
      <RecipeSlideSection
        title="인기 레시피"
        recipes={[card("r1", "된장찌개")]}
        isLoading={false}
        error={null}
        locale="ko"
      />
    );
    expect(screen.getByText("된장찌개")).toBeInTheDocument();
    await waitFor(() =>
      expect(mockPost).toHaveBeenCalledWith("/dev/recipes/status", {
        recipeIds: ["r1"],
      })
    );
    expect(screen.getByText("된장찌개")).toBeInTheDocument();
  });

  it("recipes가 비면 제목과 빈 상태를 보여준다 (T-S0-4)", () => {
    renderWithClient(
      <RecipeSlideSection
        title="인기 레시피"
        recipes={[]}
        isLoading={false}
        error={null}
        locale="ko"
      />
    );
    expect(screen.getByText("인기 레시피")).toBeInTheDocument();
  });
});
