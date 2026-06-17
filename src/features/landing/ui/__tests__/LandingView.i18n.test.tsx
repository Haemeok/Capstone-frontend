import { createRef } from "react";

import { render } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";
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
    const ja = getDictionary("ja").landing;
    const { container } = renderWithScroll(<LandingView locale="ja" />);
    expect(container.textContent).toContain(ja.hero.cta);
  });
});
