import { usePathname, useRouter } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { LanguageSettingRow } from "../LanguageSettingRow";

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
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Select language" })
    ).toBeInTheDocument();
  });

  it("T-304: ja 경로에서 라벨/aria가 일본어 사전값", () => {
    (usePathname as jest.Mock).mockReturnValue("/ja/recipes/1");
    render(<LanguageSettingRow />);
    expect(screen.getByText("言語")).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "言語を選択" })
    ).toBeInTheDocument();
  });
});
