import { createRef } from "react";

import { render } from "@testing-library/react";

import RecipeSortButton from "./RecipeSortButton";

describe("RecipeSortButton", () => {
  it("버튼 요소에 ref를 전달한다 (Popover asChild 앵커링에 필요)", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <RecipeSortButton ref={ref} currentSort="최신순" onClick={() => {}} />
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
