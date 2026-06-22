import {
  buildYoutubeExtractorMetadata,
  createYoutubeExtractorStructuredData,
} from "../youtubeExtractorMetadata";

it("T-17 en: title/desc/og 한글 없음, robots.index 유지", () => {
  const m = buildYoutubeExtractorMetadata("en");
  expect(JSON.stringify([m.title, m.description, m.openGraph])).not.toMatch(
    /[가-힣]/
  );
  expect((m.robots as { index?: boolean })?.index).toBe(true);
});
it("T-18 en JSON-LD: HowTo step 한글 없음, url에 /en/", () => {
  const blocks = createYoutubeExtractorStructuredData("en");
  const howTo = blocks.find((b) => b["@type"] === "HowTo");
  expect(JSON.stringify(howTo)).not.toMatch(/[가-힣]/);
  expect(JSON.stringify(howTo)).toMatch(/\/en\/recipes\/new\/youtube/);
});
it("ko 회귀: title 한국어 유지", () => {
  const m = buildYoutubeExtractorMetadata("ko");
  expect(JSON.stringify(m.title)).toMatch(/[가-힣]/);
});

it("en: openGraph.alternateLocale이 ko_KR, ja_JP 포함", () => {
  const m = buildYoutubeExtractorMetadata("en");
  expect(m.openGraph?.alternateLocale).toEqual(
    expect.arrayContaining(["ko_KR", "ja_JP"])
  );
});

it("ja: openGraph.alternateLocale이 ko_KR, en_US 포함", () => {
  const m = buildYoutubeExtractorMetadata("ja");
  expect(m.openGraph?.alternateLocale).toEqual(
    expect.arrayContaining(["ko_KR", "en_US"])
  );
});
