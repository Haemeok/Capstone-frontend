import { render, screen } from "@testing-library/react";

import CategoryCount from "../CategoryCount";

describe("CategoryCount", () => {
  it("전체 개수를 표시한다 (T-04)", () => {
    render(<CategoryCount total={42} />);
    expect(screen.getByText("전체 42")).toBeInTheDocument();
  });

  it("개수를 모르면 아무것도 표시하지 않는다 (T-04 edge)", () => {
    const { container } = render(<CategoryCount total={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
