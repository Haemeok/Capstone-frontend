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
  trendingTitle: "__TRENDING_TITLE__",
  trendingEmpty: "__TRENDING_EMPTY__",
  trendingPrevAria: "__PREV__",
  trendingNextAria: "__NEXT__",
  viewCountLabel: "__VIEWS__ {count}",
  duplicateTitle: "__DUP_TITLE__",
  duplicateNoCredit: "__DUP_NOCREDIT__",
  duplicateAdded: "__DUP_ADDED__",
  duplicateViewButton: "__DUP_VIEW__",
  duplicateSaveButton: "__DUP_SAVE__",
  duplicateAlreadySaved: "__DUP_SAVED__",
  previewAiDisclaimer: "__PV_AI__",
  previewImporting: "__PV_IMPORTING__",
  previewConfirmButton: "__PV_CONFIRM__",
  extractionCompleteTitle: "__DONE_TITLE__",
  maxRetryExceeded: "__MAX_RETRY__",
  pendingSectionTitle: "__PENDING_SECTION__",
  extractingStatus: "__EXTRACTING__",
  extractionSuccessStatus: "__SUCCESS__",
  extractionFailureDefault: "__FAILURE__",
  errorCloseLabel: "__ERR_LABEL__",
  errorCloseButton: "__ERR_BTN__",
  pendingLoadError: "__PENDING_ERR__",
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
