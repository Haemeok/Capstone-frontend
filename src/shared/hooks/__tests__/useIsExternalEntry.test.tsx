import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: () => "/recipes/A",
}));

jest.mock("@/shared/lib/entryContext", () => ({
  isEntryPath: jest.fn(() => true),
  hasInternalNav: jest.fn(() => false),
}));

import { hasInternalNav, isEntryPath } from "@/shared/lib/entryContext";

import { useIsExternalEntry } from "../useIsExternalEntry";

const mockedIsEntryPath = jest.mocked(isEntryPath);
const mockedHasInternalNav = jest.mocked(hasInternalNav);

const setReferrer = (value: string) => {
  Object.defineProperty(document, "referrer", { configurable: true, value });
};

const Probe = () => (
  <span data-testid="external">{String(useIsExternalEntry())}</span>
);

const renderProbe = () => {
  render(<Probe />);
  return screen.getByTestId("external").textContent;
};

describe("useIsExternalEntry", () => {
  beforeEach(() => {
    mockedIsEntryPath.mockReturnValue(true);
    mockedHasInternalNav.mockReturnValue(false);
    setReferrer("https://m.search.naver.com/search.naver?query=김치찌개");
  });

  it("외부 검색에서 진입하면 true", () => {
    expect(renderProbe()).toBe("true");
  });

  it("리퍼러가 같은 origin 이면 false", () => {
    setReferrer(`${window.location.origin}/search/results`);

    expect(renderProbe()).toBe("false");
  });

  it("리퍼러가 없으면 true", () => {
    setReferrer("");

    expect(renderProbe()).toBe("true");
  });

  it("리퍼러를 파싱할 수 없으면 true", () => {
    setReferrer("not-a-url");

    expect(renderProbe()).toBe("true");
  });

  it("진입 경로가 아니면 false", () => {
    mockedIsEntryPath.mockReturnValue(false);

    expect(renderProbe()).toBe("false");
  });

  it("내부 이동이 있었으면 false", () => {
    mockedHasInternalNav.mockReturnValue(true);

    expect(renderProbe()).toBe("false");
  });
});
