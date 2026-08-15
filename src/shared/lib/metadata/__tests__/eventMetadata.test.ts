import { buildEventMetadata } from "../eventMetadata";

describe("buildEventMetadata locale-aware (T-E04)", () => {
  const base = {
    path: "/events/world-recipes",
    title: "T",
    description: "D",
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

  it("T-20: 옵션을 생략하면 전체 hreflang과 1024 정사각형 OG 기본값을 유지한다", () => {
    const meta = buildEventMetadata({ ...base, locale: "ko" });
    const image = Array.isArray(meta.openGraph?.images)
      ? meta.openGraph.images[0]
      : undefined;

    expect(meta.alternates?.languages).toMatchObject({
      ko: "https://www.recipio.kr/events/world-recipes",
      ja: "https://www.recipio.kr/ja/events/world-recipes",
      en: "https://www.recipio.kr/en/events/world-recipes",
      "x-default": "https://www.recipio.kr/events/world-recipes",
    });
    expect(image).toMatchObject({ width: 1024, height: 1024 });
    expect(meta.openGraph?.title).toBe("T | 레시피오");
  });

  it("T-19: 지원 locale과 OG 크기·제목을 이벤트별로 제한할 수 있다", () => {
    const meta = buildEventMetadata({
      ...base,
      locale: "ko",
      supportedLocales: ["ko"],
      ogImageWidth: 512,
      ogImageHeight: 512,
      openGraphTitle: "레시피오 앱 설치",
    });
    const image = Array.isArray(meta.openGraph?.images)
      ? meta.openGraph.images[0]
      : undefined;

    expect(meta.alternates?.languages).toEqual({
      ko: "https://www.recipio.kr/events/world-recipes",
      "x-default": "https://www.recipio.kr/events/world-recipes",
    });
    expect(image).toMatchObject({ width: 512, height: 512 });
    expect(meta.openGraph?.title).toBe("레시피오 앱 설치");
  });
});
