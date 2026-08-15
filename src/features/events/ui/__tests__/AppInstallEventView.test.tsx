import { render, screen } from "@testing-library/react";

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";

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

it("T-03/T-04: 두 스토어를 안전한 새 탭 링크로 제공한다", () => {
  render(<AppInstallEventView />);
  const appStore = screen.getByRole("link", {
    name: "App Store에서 다운로드",
  });
  const playStore = screen.getByRole("link", {
    name: "Google Play에서 다운로드",
  });

  expect(appStore).toHaveAttribute("href", APP_STORE_URL);
  expect(playStore).toHaveAttribute("href", PLAY_STORE_URL);
  for (const link of [appStore, playStore]) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});
