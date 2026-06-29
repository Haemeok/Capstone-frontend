import { buildSearchDescription, buildSearchTitle } from "../searchMeta";

describe("검색 메타 — 개수 제거 (T-10, T-11)", () => {
  it("T-10: 제목에 q는 포함하고 개수 숫자는 포함하지 않는다", () => {
    const title = buildSearchTitle("김치찌개", 0, "ko");
    expect(title).toContain("김치찌개");
    expect(title).not.toMatch(/\d/);
  });

  it("T-11: 설명에 q는 포함하고 개수 숫자는 포함하지 않는다", () => {
    const desc = buildSearchDescription("김치찌개", "ko");
    expect(desc).toContain("김치찌개");
    expect(desc).not.toMatch(/\d/);
  });
});

import { getDictionary } from "@/shared/i18n";

describe("검색 메타 사전 — count 플레이스홀더 부재 (T-14)", () => {
  it.each(["ko", "ja", "en"] as const)("%s에 {count}가 없다", (locale) => {
    const d = getDictionary(locale).meta.search;
    expect(d.titleWithQuery).not.toContain("{count}");
    expect(d.descWithQuery).not.toContain("{count}");
  });
});
