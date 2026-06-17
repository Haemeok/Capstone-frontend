import { taxonomy as en } from "../en/taxonomy";
import { taxonomy as ja } from "../ja/taxonomy";

it("ingredientsApplyButton에 {count} 플레이스홀더가 있다", () => {
  expect(ja.filters.ingredientsApplyButton).toContain("{count}");
  expect(en.filters.ingredientsApplyButton).toContain("{count}");
});
