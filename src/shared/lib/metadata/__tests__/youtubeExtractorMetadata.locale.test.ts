import { buildYoutubeExtractorMetadata } from "../youtubeExtractorMetadata";

describe("youtube metadata locale (T-02)", () => {
  it("en → og:locale en_US + hreflang 4키", () => {
    const m = buildYoutubeExtractorMetadata("en");
    expect(m.openGraph?.locale).toBe("en_US");
    expect(Object.keys(m.alternates?.languages ?? {}).sort()).toEqual([
      "en",
      "ja",
      "ko",
      "x-default",
    ]);
  });
  it("ja → og:locale ja_JP", () => {
    expect(buildYoutubeExtractorMetadata("ja").openGraph?.locale).toBe("ja_JP");
  });
});
