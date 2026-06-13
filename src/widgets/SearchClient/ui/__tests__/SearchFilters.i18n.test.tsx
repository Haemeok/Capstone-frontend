import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import { SearchFilters } from "../SearchFilters";

const mockPathname = jest.fn();
const searchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => searchParams,
}));

jest.mock("@/features/search-input", () => ({
  SearchInput: () => <div data-testid="search-input-stub" />,
}));

const HANGUL = /[가-힣]/;

const makeClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe("SearchFilters i18n", () => {
  it("T-05: /ja 필터 바에 한글 잔존 없음", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    const { container } = render(
      <QueryClientProvider client={makeClient()}>
        <SearchFilters />
      </QueryClientProvider>
    );
    expect(container.textContent ?? "").not.toMatch(HANGUL);
  });

  it("T-09: ko 필터 바에는 한글 라벨이 그대로", () => {
    mockPathname.mockReturnValue("/search/results");
    const { container } = render(
      <QueryClientProvider client={makeClient()}>
        <SearchFilters />
      </QueryClientProvider>
    );
    expect(container.textContent ?? "").toMatch(HANGUL);
  });
});
