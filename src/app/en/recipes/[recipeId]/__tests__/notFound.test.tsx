import { render } from "@testing-library/react";

import EnNotFound from "../not-found";

it("T-32: en not-found가 영어 카피를 렌더한다 (비어있지 않고 한국어 아님)", () => {
  const { container } = render(<EnNotFound />);
  const text = container.textContent ?? "";
  expect(text).not.toBe("");
  expect(text).not.toContain("레시피를 찾을 수 없");
});
