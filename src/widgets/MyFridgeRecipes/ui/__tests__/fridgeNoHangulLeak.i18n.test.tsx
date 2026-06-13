import { usePathname } from "next/navigation";

import { fireEvent, render } from "@testing-library/react";

import FridgeMatchSummary from "../FridgeMatchSummary";
import MyFridgeEmptyState from "../MyFridgeEmptyState";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const hangul = /[가-힣]/;

const missing = [
  { id: "1", name: "onion" },
  { id: "2", name: "garlic" },
  { id: "3", name: "salt" },
  { id: "4", name: "pepper" },
];

describe("냉장고 위젯 한글 누락 가드", () => {
  it.each(["/ja/recipes/my-fridge", "/en/recipes/my-fridge"])(
    "%s 빈 상태에 한글 0",
    (path) => {
      setPath(path);
      const { container } = render(<MyFridgeEmptyState />);
      expect(hangul.test(container.textContent ?? "")).toBe(false);
    }
  );

  it.each(["/ja/recipes/my-fridge", "/en/recipes/my-fridge"])(
    "%s 매치 요약(필요 개수·접기·완성)에 한글 0",
    (path) => {
      setPath(path);
      const ready = render(<FridgeMatchSummary missingIngredients={[]} />);
      expect(hangul.test(ready.container.textContent ?? "")).toBe(false);
      ready.unmount();

      const { container } = render(
        <FridgeMatchSummary missingIngredients={missing} />
      );
      fireEvent.click(container.querySelector("button")!);
      expect(hangul.test(container.textContent ?? "")).toBe(false);
    }
  );
});
