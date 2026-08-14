import { render } from "@testing-library/react";

import { getRecipeItems } from "@/entities/recipe";

import CategoryDetailClient from "../CategoryDetailClient";

type CapturedOptions = {
  queryKey: unknown[];
  queryFn: (arg: { pageParam: number }) => unknown;
};

let captured: CapturedOptions | null = null;
let currentPathname = "/recipes/category/CHEF_RECIPE";

jest.mock("next/dynamic", () => () => () => null);

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
  getRecipeItems: jest.fn().mockResolvedValue({
    content: [],
    slice: { size: 0, number: 0, numberOfElements: 0, hasNext: false },
  }),
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

const renderForLocale = (locale: "ko" | "ja" | "en"): CapturedOptions => {
  const localePrefix = locale === "ko" ? "" : `/${locale}`;
  currentPathname = `${localePrefix}/recipes/category/CHEF_RECIPE`;
  captured = null;
  render(
    <CategoryDetailClient
      tagCode="CHEF_RECIPE"
      locale={locale}
      initialApiPage={1}
    />
  );
  if (captured === null) throw new Error("useInfiniteScroll was not called");
  return captured;
};

describe("category locale fetch wiring", () => {
  beforeEach(() => {
    (getRecipeItems as jest.Mock).mockClear();
  });

  it.each(["ja", "en"] as const)(
    "T-04: %s 카테고리는 locale 언어로 레시피를 요청한다",
    async (locale) => {
      const options = renderForLocale(locale);
      await options.queryFn({ pageParam: 2 });

      expect(getRecipeItems).toHaveBeenCalledWith(
        expect.objectContaining({ pageParam: 2, lang: locale })
      );
    }
  );

  it("T-04: ko 카테고리는 lang 파라미터 없이 레시피를 요청한다", async () => {
    const options = renderForLocale("ko");
    await options.queryFn({ pageParam: 2 });

    const call = (getRecipeItems as jest.Mock).mock.calls[0][0];
    expect(call).not.toHaveProperty("lang");
  });

  it.each(["ko", "ja", "en"] as const)(
    "T-12: %s 공개 2페이지 query key는 locale과 API 1페이지를 구분한다",
    (locale) => {
      const queryKey = renderForLocale(locale).queryKey;

      expect(queryKey).toEqual([
        "recipes",
        "category",
        "CHEF_RECIPE",
        "createdAt,desc",
        locale,
        "USER,AI,YOUTUBE",
        20,
        1,
      ]);
    }
  );
});
