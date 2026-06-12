import { render, screen } from "@testing-library/react";

import type { YoutubeDict } from "@/shared/i18n";

import { YoutubeImportHero } from "../YoutubeImportHero";

const SENTINEL: YoutubeDict = {
  heroTitle: "__HERO_TITLE__",
  heroDescLead: "__LEAD__",
  heroDescHighlight: "__HL__",
  heroDescTail: "__TAIL__",
  inputPlaceholder: "__PH__",
  inputClearLabel: "__CLEAR__",
  invalidUrl: "__INVALID__",
};

describe("YoutubeImportHero i18n (T-01)", () => {
  it("주입된 dict 값을 렌더하고 ko 하드코딩을 남기지 않는다", () => {
    render(<YoutubeImportHero dict={SENTINEL} />);
    expect(screen.getByText("__HERO_TITLE__")).toBeInTheDocument();
    expect(
      screen.queryByText("유튜브 레시피 가져오기")
    ).not.toBeInTheDocument();
  });
});
