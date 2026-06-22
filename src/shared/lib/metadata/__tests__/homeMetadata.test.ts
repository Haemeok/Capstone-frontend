import { buildHomeMetadata } from "../homeMetadata";

it("T-14 en: title/desc/og 한글 없음", () => {
  const m = buildHomeMetadata("en");
  expect(JSON.stringify([m.title, m.description, m.openGraph])).not.toMatch(
    /[가-힣]/
  );
});
it("T-15 en: og:url == canonical(.../en)", () => {
  const m = buildHomeMetadata("en");
  expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  expect(String(m.openGraph?.url)).toMatch(/\/en$/);
});
it("T-16 ja: og:locale=ja_JP", () => {
  expect(buildHomeMetadata("ja").openGraph?.locale).toBe("ja_JP");
});
