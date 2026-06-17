import { taxonomy as en } from "../en/taxonomy";
import { taxonomy as ja } from "../ja/taxonomy";

const HANGUL = /[가-힣]/;
const NEW_KEYS = [
  "ingredientsTitle",
  "ingredientsDescription",
  "ingredientsSearchPlaceholder",
  "ingredientsApplyButton",
] as const;

it("T-05/06/08: ja filters 신규 키에 한글이 없다", () => {
  NEW_KEYS.forEach((k) => expect(ja.filters[k]).not.toMatch(HANGUL));
});
it("T-05/06/08: en filters 신규 키에 한글이 없다", () => {
  NEW_KEYS.forEach((k) => expect(en.filters[k]).not.toMatch(HANGUL));
});
it("ingredientsApplyButton에 {count} 플레이스홀더가 있다", () => {
  expect(ja.filters.ingredientsApplyButton).toContain("{count}");
  expect(en.filters.ingredientsApplyButton).toContain("{count}");
});
