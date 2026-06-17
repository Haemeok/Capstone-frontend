import { localizeOptionValue } from "../localizeOptionValue";

const fakeLocalize = (ko: string) => (ko === "야식" ? "夜食" : ko);
const idLocalize = (ko: string) => ko;

it("T-01: 이모지+이름에서 이름만 현지화한다", () => {
  expect(localizeOptionValue("🌙 야식", "tags", fakeLocalize)).toBe("🌙 夜食");
});
it("T-02: 이모지를 보존한다", () => {
  expect(localizeOptionValue("🌙 야식", "tags", fakeLocalize)).toMatch(/^🌙 /);
});
it("T-03: ko(항등 localize)면 원문 그대로다", () => {
  expect(localizeOptionValue("🌙 야식", "tags", idLocalize)).toBe("🌙 야식");
});
it("이모지 없는 값은 전체를 현지화한다(dishType 등)", () => {
  expect(localizeOptionValue("야식", "tags", fakeLocalize)).toBe("夜食");
});
