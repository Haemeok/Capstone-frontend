import { usePathname } from "next/navigation";

import { render } from "@testing-library/react";

import { LocalizedLink } from "../LocalizedLink";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("LocalizedLink", () => {
  it("T-03: /en 페이지에서 href에 /en prefix", () => {
    setPath("/en/recipes/1");
    const { container } = render(
      <LocalizedLink href="/search">go</LocalizedLink>
    );
    expect(container.querySelector("a")).toHaveAttribute("href", "/en/search");
  });

  it("T-04: 루트(ko)에서 prefix 없음", () => {
    setPath("/");
    const { container } = render(
      <LocalizedLink href="/search">go</LocalizedLink>
    );
    expect(container.querySelector("a")).toHaveAttribute("href", "/search");
  });
});
