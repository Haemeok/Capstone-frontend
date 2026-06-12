import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import { SearchClient } from "../index";

jest.mock("@/widgets/RecipeGrid/ui/RecipeGrid", () => ({
  __esModule: true,
  default: (props: { noResultsMessage?: string; lastPageMessage?: string }) => (
    <div data-testid="recipe-grid-stub">
      <span data-testid="prop-no-results">{props.noResultsMessage}</span>
      <span data-testid="prop-last-page">{props.lastPageMessage}</span>
    </div>
  ),
}));

jest.mock("../hooks/useSearchResults", () => ({
  useSearchResults: () => ({
    recipes: [],
    hasNextPage: false,
    isFetching: false,
    isPending: false,
    ref: null,
    queryKeyString: "",
    noResults: true,
  }),
}));

jest.mock("../hooks/useResetSearchFilters", () => ({
  useResetSearchFilters: () => () => undefined,
}));

jest.mock("../ui/SearchFilters", () => ({
  SearchFilters: () => null,
}));

const makeClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderAt = (locale: "ko" | "ja") =>
  render(
    <QueryClientProvider client={makeClient()}>
      <SearchClient initialPage={0} locale={locale} />
    </QueryClientProvider>
  );

describe("T-20: search chrome strings are locale-aware", () => {
  it("ja noResultsMessage differs from ko and is non-empty", () => {
    const ko = renderAt("ko");
    const koText = ko.getByTestId("prop-no-results").textContent ?? "";
    ko.unmount();

    const ja = renderAt("ja");
    const jaText = ja.getByTestId("prop-no-results").textContent ?? "";

    expect(jaText).not.toBe("");
    expect(jaText).not.toBe(koText);
  });

  it("ja lastPageMessage differs from ko and is non-empty", () => {
    const ko = renderAt("ko");
    const koText = ko.getByTestId("prop-last-page").textContent ?? "";
    ko.unmount();

    const ja = renderAt("ja");
    const jaText = ja.getByTestId("prop-last-page").textContent ?? "";

    expect(jaText).not.toBe("");
    expect(jaText).not.toBe(koText);
  });
});
