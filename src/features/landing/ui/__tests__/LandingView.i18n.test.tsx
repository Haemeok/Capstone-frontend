import { createRef } from "react";

import { render } from "@testing-library/react";

import { ScrollContext } from "@/shared/lib/ScrollContext";

import { LandingView } from "../LandingView";

const renderWithScroll = (ui: React.ReactElement) =>
  render(
    <ScrollContext.Provider value={{ motionRef: createRef() }}>
      {ui}
    </ScrollContext.Provider>
  );

describe("LandingView", () => {
  it("locale=ja로 본문이 렌더된다 (T-06)", () => {
    const { container } = renderWithScroll(<LandingView locale="ja" />);
    expect(container.textContent).toContain("無料で始める");
  });
});
