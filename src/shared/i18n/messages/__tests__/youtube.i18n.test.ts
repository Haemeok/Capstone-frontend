import { youtube as en } from "../en/youtube";
import { youtube as ja } from "../ja/youtube";

const HANGUL = /[가-힣]/;
const KEYS = [
  "trendingTitle",
  "trendingEmpty",
  "trendingPrevAria",
  "trendingNextAria",
  "viewCountLabel",
] as const;

it("ja youtube 신규 키에 한글이 없다", () => {
  KEYS.forEach((k) => expect(ja[k]).not.toMatch(HANGUL));
});
it("en youtube 신규 키에 한글이 없다", () => {
  KEYS.forEach((k) => expect(en[k]).not.toMatch(HANGUL));
});
it("viewCountLabel에 {count} 플레이스홀더가 있다", () => {
  expect(ja.viewCountLabel).toContain("{count}");
  expect(en.viewCountLabel).toContain("{count}");
});
