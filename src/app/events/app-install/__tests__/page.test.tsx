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

import Page, { metadata } from "../page";

it("T-03: route가 앱 설치 이벤트 내용을 직접 렌더링한다", () => {
  render(<Page />);
  expect(screen.getByText("레시피오 앱")).toBeInTheDocument();
  expect(
    screen.getByText("매일 찾는 레시피, 앱에서 더 편하게")
  ).toBeInTheDocument();
});

it("T-19: 한국어 canonical과 앱 아이콘 OG metadata만 제공한다", () => {
  const image = Array.isArray(metadata.openGraph?.images)
    ? metadata.openGraph.images[0]
    : undefined;

  expect(metadata.title).toBe("레시피오 앱 설치 | 레시피오");
  expect(metadata.description).toBe(
    "YouTube 레시피 추출과 저장한 레시피 관리를 레시피오 앱에서 더 편하게 이용해보세요."
  );
  expect(metadata.alternates).toEqual({
    canonical: "https://www.recipio.kr/events/app-install",
    languages: {
      ko: "https://www.recipio.kr/events/app-install",
      "x-default": "https://www.recipio.kr/events/app-install",
    },
  });
  expect(metadata.openGraph?.title).toBe("레시피오 앱 설치");
  expect(image).toMatchObject({
    url: "/web-app-manifest-512x512.png",
    width: 512,
    height: 512,
  });
});
