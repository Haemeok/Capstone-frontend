import { render } from "@testing-library/react";

import { BottomAnchorAdSlot } from "../BottomAnchorAdSlot";

describe("BottomAnchorAdSlot", () => {
  it("비활성화 상태로 항상 null 렌더 (모바일 흰 바 제거)", () => {
    const { container } = render(<BottomAnchorAdSlot />);
    expect(container).toBeEmptyDOMElement();
  });
});
