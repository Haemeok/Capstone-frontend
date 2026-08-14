import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { generateMetadata as generateEnCategoryMetadata } from "@/app/en/recipes/category/[id]/page";
import { generateMetadata as generateJaCategoryMetadata } from "@/app/ja/recipes/category/[id]/page";

import { buildCategoryMetadata } from "../categoryMetadata";
import { generateMetadata as generateKoCategoryMetadata } from "../page";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

const flatten = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object")
    return Object.values(value).map(flatten).join(" ");
  return "";
};

describe("buildCategoryMetadata — localized (T-29~32)", () => {
  it("T-04 en 카테고리: title 접미사 Recipio + og:locale alternate", () => {
    const m = buildCategoryMetadata({
      id: "DIET",
      publicPage: 1,
      locale: "en",
    });
    expect(m.title).toMatch(/\| Recipio$/);
    expect(m.openGraph?.siteName).toBe("Recipio");
    expect(m.openGraph?.alternateLocale).toEqual(
      expect.arrayContaining(["ko_KR", "ja_JP"])
    );
  });

  it("ja CHEF_RECIPE: ja 템플릿 title + hreflang + noindex (T-29)", () => {
    const meta = buildCategoryMetadata({
      id: "CHEF_RECIPE",
      publicPage: 1,
      locale: "ja",
    });

    const jaTag = taxonomyMessages.ja.tags.CHEF_RECIPE;
    expect(meta.title).toContain(jaTag);
    expect(meta.title).not.toContain("모음");
    expect(meta.alternates?.languages).toBeDefined();
    expect(meta.robots).toMatchObject({ index: false });
  });

  it("ja CHEF: 한국 셀럽 키워드가 없다 (T-30)", () => {
    const meta = buildCategoryMetadata({
      id: "CHEF_RECIPE",
      publicPage: 1,
      locale: "ja",
    });

    const haystack = flatten(meta);
    expect(haystack).not.toContain("흑백요리사");
    expect(haystack).not.toContain("안성재");
  });

  it("ja/en 모두 robots.index === false (T-31)", () => {
    const ja = buildCategoryMetadata({
      id: "QUICK",
      publicPage: 1,
      locale: "ja",
    });
    const en = buildCategoryMetadata({
      id: "QUICK",
      publicPage: 1,
      locale: "en",
    });

    expect(ja.robots).toMatchObject({ index: false, follow: true });
    expect(en.robots).toMatchObject({ index: false, follow: true });
  });

  it("ko CHEF 회귀: index:true + CHEF 특수 title 유지 (T-32)", () => {
    const meta = buildCategoryMetadata({
      id: "CHEF_RECIPE",
      publicPage: 1,
      locale: "ko",
    });

    expect(meta.robots).toMatchObject({ index: true });
    expect(meta.title).toContain("흑백요리사");
    expect(String(meta.description)).toContain("파인다이닝");
  });
});

describe("category pagination metadata", () => {
  it.each([
    [1, "https://www.recipio.kr/recipes/category/CHEF_RECIPE"],
    [2, "https://www.recipio.kr/recipes/category/CHEF_RECIPE?page=2"],
    [3, "https://www.recipio.kr/recipes/category/CHEF_RECIPE?page=3"],
  ] as const)(
    "T-06: 공개 %i페이지는 자신의 URL을 canonical로 사용한다",
    (publicPage, expectedCanonical) => {
      const metadata = buildCategoryMetadata({
        id: "CHEF_RECIPE",
        publicPage,
        locale: "ko",
      });

      expect(metadata.alternates?.canonical).toBe(expectedCanonical);
      expect(metadata.openGraph?.url).toBe(expectedCanonical);
    }
  );

  it.each([
    [1, "흑백요리사 & 15분 레시피 후기 모음 | RECIPIO"],
    [2, "흑백요리사 & 15분 레시피 후기 모음 (2페이지) | RECIPIO"],
    [3, "흑백요리사 & 15분 레시피 후기 모음 (3페이지) | RECIPIO"],
  ] as const)(
    "T-06: CHEF_RECIPE 공개 %i페이지 title은 실제 공개 페이지 번호를 사용한다",
    (publicPage, expectedTitle) => {
      const metadata = buildCategoryMetadata({
        id: "CHEF_RECIPE",
        publicPage,
        locale: "ko",
      });

      expect(metadata.title).toBe(expectedTitle);
      expect(metadata.openGraph?.title).toBe(expectedTitle);
      expect(metadata.twitter?.title).toBe(expectedTitle);
    }
  );

  it.each(["0", "-2", "1.5", "abc"])(
    "T-07: 잘못된 page=%s의 generateMetadata는 기본 canonical을 사용한다",
    async (page) => {
      const metadata = await generateKoCategoryMetadata({
        params: Promise.resolve({ id: "CHEF_RECIPE" }),
        searchParams: Promise.resolve({ page }),
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://www.recipio.kr/recipes/category/CHEF_RECIPE"
      );
    }
  );

  it.each([
    [
      "ja",
      generateJaCategoryMetadata,
      "https://www.recipio.kr/ja/recipes/category/CHEF_RECIPE?page=2",
      "2ページ目",
    ],
    [
      "en",
      generateEnCategoryMetadata,
      "https://www.recipio.kr/en/recipes/category/CHEF_RECIPE?page=2",
      "Page 2",
    ],
  ] as const)(
    "T-08: %s 공개 2페이지 generateMetadata는 locale self-canonical을 사용한다",
    async (_locale, generateMetadata, expectedCanonical, expectedPageLabel) => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "CHEF_RECIPE" }),
        searchParams: Promise.resolve({ page: "2" }),
      });

      expect(metadata.alternates?.canonical).toBe(expectedCanonical);
      expect(metadata.openGraph?.url).toBe(expectedCanonical);
      expect(metadata.title).toContain(expectedPageLabel);
    }
  );
});
