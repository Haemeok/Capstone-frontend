import { render, screen } from "@testing-library/react";

import { IngredientSearchInput } from "../IngredientSearchInput";

it("T-06: placeholder를 prop으로 받아 렌더한다", () => {
  render(
    <IngredientSearchInput
      value=""
      onChange={() => {}}
      onSubmit={(e) => e.preventDefault()}
      placeholder="材料名を検索"
    />
  );
  expect(screen.getByPlaceholderText("材料名を検索")).toBeInTheDocument();
});
