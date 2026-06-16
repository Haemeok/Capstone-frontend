import { buildEventMetadata } from "../eventMetadata";

describe("buildEventMetadata locale-aware (T-E04)", () => {
  const base = {
    path: "/events/world-recipes",
    title: "T",
    description: "D",
    keywords: ["k"],
    ogImage: "/events/world-recipes/hero.png",
    ogImageAlt: "alt",
  };

  it("ja: locale self-canonical + hreflang + og locale + indexable", () => {
    const meta = buildEventMetadata({ ...base, locale: "ja" });
    expect(meta.alternates?.canonical).toBe(
      "https://www.recipio.kr/ja/events/world-recipes"
    );
    expect(meta.alternates?.languages).toMatchObject({
      ko: "https://www.recipio.kr/events/world-recipes",
      ja: "https://www.recipio.kr/ja/events/world-recipes",
      en: "https://www.recipio.kr/en/events/world-recipes",
    });
    expect((meta.openGraph as { locale?: string } | undefined)?.locale).toBe(
      "ja_JP"
    );
    expect((meta.robots as { index?: boolean } | undefined)?.index).not.toBe(
      false
    );
  });

  it("ko: 루트 canonical", () => {
    const meta = buildEventMetadata({ ...base, locale: "ko" });
    expect(meta.alternates?.canonical).toBe(
      "https://www.recipio.kr/events/world-recipes"
    );
  });
});
