import { youtube as en } from "../en/youtube";
import { youtube as ja } from "../ja/youtube";

it("viewCountLabel에 {count} 플레이스홀더가 있다", () => {
  expect(ja.viewCountLabel).toContain("{count}");
  expect(en.viewCountLabel).toContain("{count}");
});
