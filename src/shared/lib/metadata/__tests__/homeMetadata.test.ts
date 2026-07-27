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
it("ko 홈 원복: og:site_name·description 복원", () => {
  const m = buildHomeMetadata("ko");
  expect(m.openGraph?.siteName).toBe("레시피오 - recipio");
  expect(String(m.description)).toMatch(/홈파티·기념일·다이어트/);
});
it("en 홈 회귀: siteName Recipio", () => {
  expect(buildHomeMetadata("en").openGraph?.siteName).toBe("Recipio");
});
