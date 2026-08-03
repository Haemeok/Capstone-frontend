import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { format, getDictionary } from "@/shared/i18n";

import { STEP_FONT_LEVEL_COUNT } from "../../model/useStepFontSizeStore";
import StepFontSizeButton from "../StepFontSizeButton";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

const dictOf = (locale: "ko" | "ja" | "en") =>
  getDictionary(locale).uiCommon.stepFontSize;

describe("StepFontSizeButton i18n", () => {
  it.each([
    ["/recipes/r1", "ko"],
    ["/ja/recipes/r1", "ja"],
    ["/en/recipes/r1", "en"],
  ] as const)("T-01: %s → %s 글리프와 aria 라벨", (path, locale) => {
    setPath(path);
    const t = dictOf(locale);
    render(<StepFontSizeButton />);

    expect(
      screen.getByLabelText(
        format(t.toggleAria, { current: 1, total: STEP_FONT_LEVEL_COUNT })
      )
    ).toBeInTheDocument();
    expect(screen.getByText(t.sampleGlyph)).toBeInTheDocument();
  });

  it("T-02: ja/en 글리프에 한글이 없다", () => {
    expect(dictOf("ja").sampleGlyph).not.toMatch(/[가-힣]/);
    expect(dictOf("en").sampleGlyph).not.toMatch(/[가-힣]/);
  });
});
