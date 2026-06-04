import { render, screen } from "@testing-library/react";

import { CreatorCountryFlag } from "../CreatorCountryFlag";

describe("CreatorCountryFlag", () => {
  it("JP는 일본 국기와 스크린리더 라벨을 렌더한다", () => {
    render(<CreatorCountryFlag tag="JP" />);
    const flag = screen.getByRole("img", { name: "일본 채널" });
    expect(flag).toHaveTextContent("🇯🇵");
  });

  it("OTHER는 해외 국기와 라벨을 렌더한다", () => {
    render(<CreatorCountryFlag tag="OTHER" />);
    const flag = screen.getByRole("img", { name: "해외 채널" });
    expect(flag).toHaveTextContent("🌐");
  });

  it("KR은 아무것도 렌더하지 않는다", () => {
    const { container } = render(<CreatorCountryFlag tag="KR" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("undefined는 아무것도 렌더하지 않는다", () => {
    const { container } = render(<CreatorCountryFlag tag={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
