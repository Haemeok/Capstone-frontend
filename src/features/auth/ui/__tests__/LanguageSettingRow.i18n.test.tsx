import { usePathname, useRouter } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import { LanguageSettingRow } from "../LanguageSettingRow";

const en = getDictionary("en").settings;
const ja = getDictionary("ja").settings;

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
});

describe("LanguageSettingRow i18n", () => {
  it("T-304: en 경로에서 라벨/aria가 영어 사전값", () => {
    (usePathname as jest.Mock).mockReturnValue("/en/recipes/1");
    render(<LanguageSettingRow />);
    expect(screen.getByText(en.language)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: en.languageSelectAria })
    ).toBeInTheDocument();
  });

  it("T-304: ja 경로에서 라벨/aria가 일본어 사전값", () => {
    (usePathname as jest.Mock).mockReturnValue("/ja/recipes/1");
    render(<LanguageSettingRow />);
    expect(screen.getByText(ja.language)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: ja.languageSelectAria })
    ).toBeInTheDocument();
  });
});
