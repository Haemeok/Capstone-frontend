import { render } from "@testing-library/react";

import JaPrivateRecipeNotFound from "../not-found";

it("T-P06: ja 비공개 not-found가 일본어 카피를 렌더한다 (비어있지 않고 한국어 아님)", () => {
  const { container } = render(<JaPrivateRecipeNotFound />);
  const text = container.textContent ?? "";
  expect(text).not.toBe("");
  expect(/[가-힣]/.test(text)).toBe(false);
});
