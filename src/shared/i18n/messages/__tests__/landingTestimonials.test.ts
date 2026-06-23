import { getDictionary } from "@/shared/i18n";

describe("landing testimonials dict data", () => {
  it("ja/en items 길이는 6~8 사이다 (T-20)", () => {
    for (const locale of ["ja", "en"] as const) {
      const items = getDictionary(locale).landing.testimonials.items;
      expect(items.length).toBeGreaterThanOrEqual(6);
      expect(items.length).toBeLessThanOrEqual(8);
    }
  });

  it("ko items 길이는 정확히 13다 (T-21)", () => {
    const items = getDictionary("ko").landing.testimonials.items;
    expect(items.length).toBe(13);
  });

  it("ja/en items에 한글·원·성시경이 없다 (T-22)", () => {
    for (const locale of ["ja", "en"] as const) {
      const items = getDictionary(locale).landing.testimonials.items;
      const allText = items
        .map((item) =>
          [item.name, item.role, item.content, item.highlight].join(" ")
        )
        .join(" ");
      expect(allText).not.toMatch(/[가-힣]/);
      expect(allText).not.toContain("원");
      expect(allText).not.toContain("성시경");
    }
  });
});
