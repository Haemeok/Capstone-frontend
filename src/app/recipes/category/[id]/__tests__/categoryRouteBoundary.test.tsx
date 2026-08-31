import { notFound } from "next/navigation";

import EnCategoryPage, {
  generateMetadata as generateEnMetadata,
} from "@/app/en/recipes/category/[id]/page";
import JaCategoryPage, {
  generateMetadata as generateJaMetadata,
} from "@/app/ja/recipes/category/[id]/page";

import KoCategoryPage, {
  generateMetadata as generateKoMetadata,
} from "../page";
import { renderCategoryPage } from "../renderCategoryPage";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("../renderCategoryPage", () => ({
  renderCategoryPage: jest.fn(),
}));

const mockedNotFound = jest.mocked(notFound);
const mockedRenderCategoryPage = jest.mocked(renderCategoryPage);
const searchParams = Promise.resolve({});

const routes = [
  ["ko", KoCategoryPage, generateKoMetadata],
  ["en", EnCategoryPage, generateEnMetadata],
  ["ja", JaCategoryPage, generateJaMetadata],
] as const;

describe("category dynamic route boundary", () => {
  beforeEach(() => {
    mockedNotFound.mockClear();
    mockedRenderCategoryPage.mockClear();
  });

  it.each(routes)(
    "%s route는 NOT_A_TAG를 renderer와 API로 보내기 전에 notFound 처리한다",
    async (_locale, CategoryPage) => {
      await expect(
        CategoryPage({
          params: Promise.resolve({ id: "NOT_A_TAG" }),
          searchParams,
        })
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(mockedNotFound).toHaveBeenCalledTimes(1);
      expect(mockedRenderCategoryPage).not.toHaveBeenCalled();
    }
  );

  it.each(routes)(
    "%s route는 유효한 CHEF_RECIPE를 locale renderer에 전달한다",
    async (locale, CategoryPage) => {
      await CategoryPage({
        params: Promise.resolve({ id: "CHEF_RECIPE" }),
        searchParams,
      });

      expect(mockedNotFound).not.toHaveBeenCalled();
      expect(mockedRenderCategoryPage).toHaveBeenCalledWith({
        tagCode: "CHEF_RECIPE",
        searchParams: {},
        locale,
      });
    }
  );

  it.each(routes)(
    "%s generateMetadata도 NOT_A_TAG를 fallback 문서로 노출하지 않고 notFound 처리한다",
    async (_locale, _CategoryPage, generateMetadata) => {
      await expect(
        generateMetadata({
          params: Promise.resolve({ id: "NOT_A_TAG" }),
          searchParams,
        })
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(mockedNotFound).toHaveBeenCalledTimes(1);
    }
  );
});
