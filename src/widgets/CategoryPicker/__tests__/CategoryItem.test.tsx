import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({ usePathname: () => "/ja/search" }));
jest.mock("@/shared/ui/image/Image", () => ({
  __esModule: true,
  Image: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));

import CategoryItem from "../CategoryItem";

it("T-01: ja에서 태그 드로어 항목이 현지어로 보인다(이모지 보존)", () => {
  render(
    <CategoryItem
      value="🌙 야식"
      isSelected={false}
      onToggle={() => {}}
      isMultiple
      domain="tags"
    />
  );
  const label = screen.getByText(/🌙/);
  expect(label.textContent).not.toContain("야식");
});

it("T-04: toggle은 현지화 표시와 무관하게 코드값(원문)으로 호출된다", async () => {
  const onToggle = jest.fn();
  render(
    <CategoryItem
      value="🌙 야식"
      isSelected={false}
      onToggle={onToggle}
      isMultiple
      domain="tags"
    />
  );
  await userEvent.click(screen.getByRole("checkbox"));
  expect(onToggle).toHaveBeenCalledWith("🌙 야식");
});
