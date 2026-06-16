import { render } from "@testing-library/react";

import { CoupangDisclosure } from "../CoupangDisclosure";

describe("CoupangDisclosure i18n", () => {
  it("T-04: ja -> 렌더 안 함(null)", () => {
    const { container } = render(<CoupangDisclosure locale="ja" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("T-04: en -> 렌더 안 함(null)", () => {
    const { container } = render(<CoupangDisclosure locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("T-05(anchor): ko -> 공시 렌더", () => {
    const { container } = render(<CoupangDisclosure locale="ko" />);
    expect(container.textContent).toContain("쿠팡 파트너스");
  });
});
