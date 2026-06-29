import { render } from "@testing-library/react";

import { getRecipeItems } from "@/entities/recipe";

import CategoryDetailClient from "../CategoryDetailClient";

type CapturedOptions = {
  queryKey: unknown[];
  queryFn: (arg: { pageParam: number }) => unknown;
};

let captured: CapturedOptions | null = null;
let currentPathname = "/recipes/category/CHEF_RECIPE";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "CHEF_RECIPE" }),
  usePathname: () => currentPathname,
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock("@/shared/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: (options: CapturedOptions) => {
    captured = options;
    return {
      data: undefined,
      hasNextPage: false,
      isFetching: false,
      ref: jest.fn(),
    };
  },
}));

jest.mock("@/entities/recipe", () => ({
  getRecipeItems: jest
    .fn()
    .mockResolvedValue({
      content: [],
      slice: { size: 0, number: 0, numberOfElements: 0, hasNext: false },
    }),
}));

jest.mock("@/shared/ui/SortPicker", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/widgets/RecipeGrid/ui/RecipeGrid", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/shared/hooks/useSort", () => ({
  useSort: () => ({
    currentSort: "createdAt,DESC",
    setSort: jest.fn(),
    getSortParam: () => "createdAt,desc",
    availableSorts: [],
  }),
}));

const renderAt = (pathname: string): CapturedOptions => {
  currentPathname = pathname;
  captured = null;
  render(<CategoryDetailClient />);
  if (captured === null) throw new Error("useInfiniteScroll was not called");
  return captured;
};

describe("category locale fetch wiring", () => {
  beforeEach(() => {
    (getRecipeItems as jest.Mock).mockClear();
  });

  it("ja에서 getRecipeItems를 lang:'ja'로 호출한다 (T-27)", async () => {
    const options = renderAt("/ja/recipes/category/CHEF_RECIPE");
    await options.queryFn({ pageParam: 0 });

    expect(getRecipeItems).toHaveBeenCalledWith(
      expect.objectContaining({ lang: "ja" })
    );
  });

  it("ko에서는 lang 파라미터를 보내지 않는다 (T-27 edge)", async () => {
    const options = renderAt("/recipes/category/CHEF_RECIPE");
    await options.queryFn({ pageParam: 0 });

    const call = (getRecipeItems as jest.Mock).mock.calls[0][0];
    expect(call).not.toHaveProperty("lang");
  });

  it("queryKey가 locale을 포함해 ja≠ko로 분리된다 (T-28)", () => {
    const jaKey = renderAt("/ja/recipes/category/CHEF_RECIPE").queryKey;
    const koKey = renderAt("/recipes/category/CHEF_RECIPE").queryKey;

    expect(jaKey).toEqual(["recipes", "CHEF_RECIPE", "createdAt,desc", "ja"]);
    expect(koKey).toEqual(["recipes", "CHEF_RECIPE", "createdAt,desc", "ko"]);
    expect(jaKey).not.toEqual(koKey);
  });
});
