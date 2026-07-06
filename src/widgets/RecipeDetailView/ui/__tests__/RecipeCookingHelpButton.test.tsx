import { fireEvent, render, screen } from "@testing-library/react";

import { cookingHelpMessages } from "@/shared/i18n/cookingHelpMessages";
import { cookingUnitsMessages } from "@/shared/i18n/cookingUnitsMessages";

import RecipeCookingHelpButton from "../RecipeCookingHelpButton";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const HANGUL = /[가-힣]/;

const setViewport = (isMobile: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
};

beforeEach(() => {
  mockPathname.mockReturnValue("/recipes/abc");
  setViewport(false);
});

it("T-01: 버튼을 누르면 변환표와 셰프의 팁이 한 시트에 함께 뜬다", () => {
  const ko = cookingHelpMessages.ko;
  const unit = cookingUnitsMessages.ko.conversions[0].unit;
  render(<RecipeCookingHelpButton tips={"바로 볶지 말고\n중불로"} />);

  const trigger = screen.getByRole("button", { name: ko.buttonLabel });
  expect(trigger).toBeInTheDocument();

  fireEvent.click(trigger);
  expect(screen.getByText(unit)).toBeInTheDocument();
  expect(screen.getByText("바로 볶지 말고 중불로")).toBeInTheDocument();
});

it("T-02: 모바일에서는 하단 Drawer로 뜬다", () => {
  setViewport(true);
  render(<RecipeCookingHelpButton tips="tip" />);
  fireEvent.click(
    screen.getByRole("button", { name: cookingHelpMessages.ko.buttonLabel })
  );
  expect(
    document.querySelector('[data-slot="drawer-content"]')
  ).toBeInTheDocument();
});

it("T-03: ja 로케일에서 버튼·섹션 라벨이 ja 값이고 한글이 없다", () => {
  mockPathname.mockReturnValue("/ja/recipes/abc");
  const ja = cookingHelpMessages.ja;
  const { baseElement } = render(<RecipeCookingHelpButton tips="test tip" />);

  fireEvent.click(screen.getByRole("button", { name: ja.buttonLabel }));

  expect(screen.getByText(ja.tableTab)).toBeInTheDocument();
  expect(screen.getByText(ja.tipsTab)).toBeInTheDocument();
  expect(HANGUL.test(baseElement.textContent ?? "")).toBe(false);
});

it("T-04: 변환표 섹션이 셰프의 팁 섹션보다 위에 온다", () => {
  const ko = cookingHelpMessages.ko;
  render(<RecipeCookingHelpButton tips="맛있게" />);
  fireEvent.click(screen.getByRole("button", { name: ko.buttonLabel }));

  const tableHeading = screen.getByText(ko.tableTab);
  const tipsHeading = screen.getByText(ko.tipsTab);
  expect(
    tableHeading.compareDocumentPosition(tipsHeading) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
});

it("T-07: 팁이 없으면 버튼은 뜨지만 변환표만 나오고 셰프의 팁 섹션이 없다", () => {
  const ko = cookingHelpMessages.ko;
  const unit = cookingUnitsMessages.ko.conversions[0].unit;
  render(<RecipeCookingHelpButton tips={undefined} />);

  const trigger = screen.getByRole("button", { name: ko.buttonLabel });
  expect(trigger).toBeInTheDocument();
  fireEvent.click(trigger);

  expect(screen.getByText(unit)).toBeInTheDocument();
  expect(screen.queryByText(ko.tipsTab)).not.toBeInTheDocument();
});
