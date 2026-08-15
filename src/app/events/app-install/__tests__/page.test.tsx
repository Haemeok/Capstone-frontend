import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: () => "/events/app-install",
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock("@/shared/lib/bridge", () => ({
  isAppWebView: () => false,
  triggerHaptic: jest.fn(),
}));
jest.mock("@next/third-parties/google", () => ({ sendGAEvent: jest.fn() }));

import Page from "../page";

it("T-03: route가 앱 설치 이벤트 내용을 직접 렌더링한다", () => {
  render(<Page />);
  expect(screen.getByText("레시피오 앱")).toBeInTheDocument();
  expect(
    screen.getByText("매일 찾는 레시피, 앱에서 더 편하게")
  ).toBeInTheDocument();
});
