import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { buildCategoryMetadata } from "../categoryMetadata";

const flatten = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object")
    return Object.values(value).map(flatten).join(" ");
  return "";
};

describe("buildCategoryMetadata — localized (T-29~32)", () => {
  it("ja CHEF_RECIPE: ja 템플릿 title + hreflang + noindex (T-29)", () => {
    const meta = buildCategoryMetadata({
      id: "CHEF_RECIPE",
      page: 0,
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
      page: 0,
      locale: "ja",
    });

    const haystack = flatten(meta);
    expect(haystack).not.toContain("흑백요리사");
    expect(haystack).not.toContain("안성재");
  });

  it("ja/en 모두 robots.index === false (T-31)", () => {
    const ja = buildCategoryMetadata({ id: "QUICK", page: 0, locale: "ja" });
    const en = buildCategoryMetadata({ id: "QUICK", page: 0, locale: "en" });

    expect(ja.robots).toMatchObject({ index: false, follow: true });
    expect(en.robots).toMatchObject({ index: false, follow: true });
  });

  it("ko CHEF 회귀: index:true + CHEF 특수 title 유지 (T-32)", () => {
    const meta = buildCategoryMetadata({
      id: "CHEF_RECIPE",
      page: 0,
      locale: "ko",
    });

    expect(meta.robots).toMatchObject({ index: true });
    expect(meta.title).toContain("흑백요리사");
    expect(flatten(meta)).toContain("안성재");
  });
});
