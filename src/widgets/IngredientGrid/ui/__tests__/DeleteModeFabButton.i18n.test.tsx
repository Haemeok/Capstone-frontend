import { render, screen } from "@testing-library/react";

import { format, plural } from "@/shared/i18n/format";
import { ingredientsMessages } from "@/shared/i18n/ingredientsMessages";

import DeleteModeFabButton from "../DeleteModeFabButton";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const HANGUL = /[가-힣]/;
const expected = (loc: "ko" | "ja" | "en", count: number) =>
  format(plural(count, ingredientsMessages[loc].deleteFab), { count });

describe("DeleteModeFabButton plural i18n", () => {
  it.each([
    ["/ja/ingredients", "ja"] as const,
    ["/en/ingredients", "en"] as const,
  ])("T-17: %s count=3 FAB가 현지 언어로 표시된다", (path, loc) => {
    mockPathname.mockReturnValue(path);
    render(<DeleteModeFabButton selectedCount={3} onDelete={() => {}} />);
    expect(screen.getByText(expected(loc, 3))).toBeInTheDocument();
  });

  it("T-18: /en에서 count=1(one)과 count=2(other) 형태가 다르다", () => {
    mockPathname.mockReturnValue("/en/ingredients");
    const { rerender } = render(
      <DeleteModeFabButton selectedCount={1} onDelete={() => {}} />
    );
    expect(screen.getByText(expected("en", 1))).toBeInTheDocument();
    rerender(<DeleteModeFabButton selectedCount={2} onDelete={() => {}} />);
    expect(screen.getByText(expected("en", 2))).toBeInTheDocument();
    expect(expected("en", 1)).not.toEqual(expected("en", 2));
  });

  it("T-19: /ja에서 count=1과 2가 동일(other) 형태다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    expect(expected("ja", 1)).toEqual(
      format(ingredientsMessages.ja.deleteFab.other, { count: 1 })
    );
  });

  it.each([["/ja/ingredients"] as const, ["/en/ingredients"] as const])(
    "T-20: %s FAB 렌더에 한글이 없다",
    (path) => {
      mockPathname.mockReturnValue(path);
      const { container } = render(
        <DeleteModeFabButton selectedCount={2} onDelete={() => {}} />
      );
      expect(container.textContent ?? "").not.toMatch(HANGUL);
    }
  );
});
