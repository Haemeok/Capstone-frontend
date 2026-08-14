/** @jest-environment jsdom */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getRecipeItems } from "@/entities/recipe";

import { renderCategoryPage } from "../renderCategoryPage";
import { makeCategoryPage } from "./categoryTestFixtures";

let mockSetInView: ((inView: boolean) => void) | undefined;

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/recipes/category/CHEF_RECIPE",
  useParams: () => ({ id: "CHEF_RECIPE" }),
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => {
    const React = jest.requireActual("react") as typeof import("react");
    const [inView, setInView] = React.useState(false);
    mockSetInView = setInView;
    return { ref: jest.fn(), inView };
  },
}));

jest.mock(
  "lodash.throttle",
  () => (fn: () => void) => Object.assign(fn, { cancel: jest.fn() })
);

jest.mock("next/dynamic", () => () => {
  const MockSortPicker = ({
    onSortChange,
  }: {
    onSortChange: (sort: string) => void;
  }) => (
    <button type="button" onClick={() => onSortChange("좋아요순")}>
      좋아요순 선택
    </button>
  );
  MockSortPicker.displayName = "MockSortPicker";
  return MockSortPicker;
});

jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: () => null,
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

jest.mock("@/entities/recipe", () => {
  const actual = jest.requireActual("@/entities/recipe");
  return { ...actual, getRecipeItems: jest.fn() };
});

const mockedGetRecipeItems = getRecipeItems as jest.MockedFunction<
  typeof getRecipeItems
>;
const originalFetch = global.fetch;

const renderHydratedPage = async (serverPage = makeCategoryPage(0, true)) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => serverPage,
  }) as unknown as typeof fetch;

  const tree = await renderCategoryPage({
    tagCode: "CHEF_RECIPE",
    searchParams: {},
    locale: "ko",
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  const PageUnderTest = () => (
    <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>
  );
  const view = render(<PageUnderTest />);

  return {
    ...view,
    queryClient,
  };
};

describe("category hydration", () => {
  beforeEach(() => {
    mockSetInView = undefined;
    mockedGetRecipeItems.mockReset();
    mockedGetRecipeItems.mockResolvedValue(makeCategoryPage(0, false, 0));
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("T-09: hydrate 직후 API 0페이지를 다시 요청하지 않는다", async () => {
    await renderHydratedPage();

    expect(
      (await screen.findAllByText("셰프 레시피 0-01")).length
    ).toBeGreaterThan(0);
    expect(mockedGetRecipeItems).not.toHaveBeenCalled();
  });

  it("T-10: 공개 1페이지 끝에서는 API 1페이지를 추가한다", async () => {
    mockedGetRecipeItems.mockResolvedValue(makeCategoryPage(1, false));
    await renderHydratedPage();

    act(() => mockSetInView?.(true));

    await waitFor(() =>
      expect(mockedGetRecipeItems).toHaveBeenCalledWith(
        expect.objectContaining({ pageParam: 1, size: 20 })
      )
    );
    expect(
      (await screen.findAllByText("셰프 레시피 1-01")).length
    ).toBeGreaterThan(0);
  });

  it("T-11: 좋아요순은 별도 query key와 likeCount 정렬을 사용한다", async () => {
    mockedGetRecipeItems.mockResolvedValue(makeCategoryPage(0, false));
    const { queryClient } = await renderHydratedPage();

    await userEvent.click(
      screen.getByRole("button", { name: "좋아요순 선택" })
    );

    await waitFor(() =>
      expect(mockedGetRecipeItems).toHaveBeenCalledWith(
        expect.objectContaining({ sort: "likeCount,desc", size: 20 })
      )
    );
    expect(
      queryClient.getQueryCache().find({
        exact: true,
        queryKey: [
          "recipes",
          "category",
          "CHEF_RECIPE",
          "likeCount,desc",
          "ko",
          "USER,AI,YOUTUBE",
          20,
          0,
        ],
      })
    ).toBeDefined();
  });

  it("T-05: 빈 SSR 결과는 빈 상태를 보이고 추가 페이지를 요청하지 않는다", async () => {
    await renderHydratedPage(makeCategoryPage(0, false, 0));

    expect(
      await screen.findByText(/아직 .* 레시피가 없어요/)
    ).toBeInTheDocument();

    act(() => mockSetInView?.(true));

    await waitFor(() => expect(mockedGetRecipeItems).not.toHaveBeenCalled());
  });
});
