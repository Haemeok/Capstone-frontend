import { render, screen } from "@testing-library/react";

import MyFridgeEmptyState from "../MyFridgeEmptyState";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

describe("MyFridgeEmptyState CTA locale-sticky", () => {
  it.each([
    ["/ja/recipes/my-fridge", "/ja/ingredients/new"],
    ["/en/recipes/my-fridge", "/en/ingredients/new"],
    ["/recipes/my-fridge", "/ingredients/new"],
  ])("%s CTA href → %s (T-23/T-24)", (path, href) => {
    mockPathname.mockReturnValue(path);
    render(<MyFridgeEmptyState />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", href);
  });
});
