import { render, screen } from "@testing-library/react";

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";

let mockIsApp = false;

jest.mock("@/shared/hooks/useIsApp", () => ({
  useIsApp: () => mockIsApp,
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/events/app-install",
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock("@/shared/lib/bridge", () => ({
  isAppWebView: () => false,
  triggerHaptic: jest.fn(),
}));
jest.mock("@next/third-parties/google", () => ({ sendGAEvent: jest.fn() }));

import { AppInstallEventView } from "../AppInstallEventView";

beforeEach(() => {
  mockIsApp = false;
});

it("T-03/T-04: 두 스토어를 안전한 새 탭 링크로 제공한다", () => {
  render(<AppInstallEventView />);
  const appStoreLinks = screen.getAllByRole("link", {
    name: "App Store에서 다운로드",
  });
  const playStoreLinks = screen.getAllByRole("link", {
    name: "Google Play에서 다운로드",
  });

  for (const link of appStoreLinks) {
    expect(link).toHaveAttribute("href", APP_STORE_URL);
  }
  for (const link of playStoreLinks) {
    expect(link).toHaveAttribute("href", PLAY_STORE_URL);
  }
  for (const link of [...appStoreLinks, ...playStoreLinks]) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

it("T-06: 세 가지 앱 장점을 정해진 순서로 보여준다", () => {
  render(<AppInstallEventView />);
  const titles = [
    screen.getByText("링크만 넣으면 재료와 순서가 한눈에"),
    screen.getByText("다시 볼 요리는 한곳에"),
    screen.getByText("홈 화면에서 바로 시작"),
  ];

  expect(screen.getByText("영상 정리")).toBeInTheDocument();
  expect(screen.getByText("레시피 저장")).toBeInTheDocument();
  expect(screen.getByText("빠른 실행")).toBeInTheDocument();

  expect(
    titles[0].compareDocumentPosition(titles[1]) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(
    titles[1].compareDocumentPosition(titles[2]) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
});

it("T-07/T-08: 앱 아이콘과 상단·하단 스토어 배지를 배치한다", () => {
  render(<AppInstallEventView />);
  const icon = screen.getByRole("img", { name: "레시피오 앱 아이콘" });
  const firstBenefit = screen.getByText("링크만 넣으면 재료와 순서가 한눈에");
  const lastBenefit = screen.getByText("홈 화면에서 바로 시작");
  const appStoreLinks = screen.getAllByRole("link", {
    name: "App Store에서 다운로드",
  });
  const playStoreLinks = screen.getAllByRole("link", {
    name: "Google Play에서 다운로드",
  });

  expect(appStoreLinks).toHaveLength(2);
  expect(playStoreLinks).toHaveLength(2);
  expect(
    icon.compareDocumentPosition(firstBenefit) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(
    appStoreLinks[0].compareDocumentPosition(firstBenefit) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(
    playStoreLinks[0].compareDocumentPosition(firstBenefit) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(
    lastBenefit.compareDocumentPosition(appStoreLinks[1]) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(
    lastBenefit.compareDocumentPosition(playStoreLinks[1]) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
});

it("T-09: 보상이나 기간 한정 혜택으로 오해할 문구가 없다", () => {
  const { container } = render(<AppInstallEventView />);
  const text = container.textContent ?? "";
  for (const forbidden of ["보상", "쿠폰", "기간 한정", "광고 제거"]) {
    expect(text).not.toContain(forbidden);
  }
});

it("T-10: 최대 480px 단일 컬럼 shell을 유지한다", () => {
  render(<AppInstallEventView />);
  expect(screen.getByRole("banner").parentElement).toHaveClass(
    "w-full",
    "max-w-[480px]"
  );
});

it("T-14: 앱 WebView에서는 스토어 배지 대신 현재 앱 안내를 보여준다", () => {
  mockIsApp = true;
  render(<AppInstallEventView />);

  expect(screen.getAllByText("현재 앱을 이용 중이에요")).toHaveLength(2);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
