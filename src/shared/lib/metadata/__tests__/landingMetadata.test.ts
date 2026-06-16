import { buildLandingMetadata } from "../landingMetadata";

describe("buildLandingMetadata (T-40~43)", () => {
  it("T-40: ja alternates.languages에 ko/ja/en/x-default 키 존재", () => {
    const m = buildLandingMetadata("ja");
    expect(Object.keys(m.alternates?.languages ?? {}).sort()).toEqual([
      "en",
      "ja",
      "ko",
      "x-default",
    ]);
  });

  it("T-41: ja canonical에 ja/landing 포함", () => {
    const m = buildLandingMetadata("ja");
    const canonical = m.alternates?.canonical as string;
    expect(canonical).toContain("ja/landing");
  });

  it("T-42: ja openGraph.locale === ja_JP 이고 title에 한글 없음", () => {
    const m = buildLandingMetadata("ja");
    expect(m.openGraph?.locale).toBe("ja_JP");
    const title =
      typeof m.openGraph?.title === "string" ? m.openGraph.title : "";
    expect(title).not.toMatch(/[가-힣]/);
  });

  it("T-43: ja robots에 noindex 없음", () => {
    const m = buildLandingMetadata("ja");
    const robots = m.robots;
    if (robots === null || robots === undefined) return;
    if (typeof robots === "string") {
      expect(robots).not.toContain("noindex");
    } else {
      expect((robots as { index?: boolean }).index).not.toBe(false);
    }
  });
});
