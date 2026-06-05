import { fireEvent, render, screen } from "@testing-library/react";

import { CountryFilterSection } from "../CountryFilterSection";

describe("CountryFilterSection", () => {
  it("한국·일본·기타 세 옵션을 노출한다", () => {
    render(
      <CountryFilterSection
        selectedCountries={[]}
        onCountriesChange={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: /한국/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /일본/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /기타/ })).toBeInTheDocument();
  });

  it("한국 옵션에 국기 SVG가 있다", () => {
    render(
      <CountryFilterSection
        selectedCountries={[]}
        onCountriesChange={() => {}}
      />
    );
    const krButton = screen.getByRole("button", { name: /한국/ });
    expect(krButton.querySelector("svg")).toBeInTheDocument();
  });

  it("옵션을 누르면 토글된 목록으로 onCountriesChange를 호출한다", () => {
    const onChange = jest.fn();
    render(
      <CountryFilterSection
        selectedCountries={[]}
        onCountriesChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /일본/ }));
    expect(onChange).toHaveBeenCalledWith(["일본"]);
  });

  it("이미 선택된 옵션을 누르면 목록에서 제거한다", () => {
    const onChange = jest.fn();
    render(
      <CountryFilterSection
        selectedCountries={["일본"]}
        onCountriesChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /일본/ }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
