import { fireEvent, render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { CountryFilterSection } from "../CountryFilterSection";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const NOOP = () => {};
const EMPTY: string[] = [];

describe("CountryFilterSection i18n", () => {
  it("/ja에서 heading과 국가 라벨이 ja 사전값", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(
      <CountryFilterSection
        selectedCountries={EMPTY}
        onCountriesChange={NOOP}
      />
    );
    expect(
      screen.getByText(taxonomyMessages.ja.filters.countrySection)
    ).toBeInTheDocument();
    expect(
      screen.getByText(taxonomyMessages.ja.country["한국"])
    ).toBeInTheDocument();
    expect(screen.queryByText("크리에이터 국가")).not.toBeInTheDocument();
  });

  it("/ja에서 옵션을 눌러도 ko 라벨이 전달된다", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    const onChange = jest.fn();
    render(
      <CountryFilterSection
        selectedCountries={EMPTY}
        onCountriesChange={onChange}
      />
    );
    fireEvent.click(screen.getByText(taxonomyMessages.ja.country["한국"]));
    expect(onChange).toHaveBeenCalledWith(["한국"]);
  });

  it("ko에서 한글 라벨 유지", () => {
    mockPathname.mockReturnValue("/search/results");
    render(
      <CountryFilterSection
        selectedCountries={EMPTY}
        onCountriesChange={NOOP}
      />
    );
    expect(screen.getByText("크리에이터 국가")).toBeInTheDocument();
    expect(screen.getByText("한국")).toBeInTheDocument();
  });
});
