import { render } from "@testing-library/react";

import EnPrivateRecipeNotFound from "../not-found";

it("T-P06: en 비공개 not-found가 영어 카피를 렌더한다 (비어있지 않고 한국어 아님)", () => {
  const { container } = render(<EnPrivateRecipeNotFound />);
  const text = container.textContent ?? "";
  expect(text).not.toBe("");
  expect(/[가-힣]/.test(text)).toBe(false);
});
