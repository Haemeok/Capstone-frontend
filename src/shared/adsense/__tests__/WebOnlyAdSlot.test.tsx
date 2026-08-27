import { render, screen } from "@testing-library/react";

import { useIsApp } from "@/shared/hooks/useIsApp";

import { WebOnlyAdSlot } from "../WebOnlyAdSlot";

jest.mock("@/shared/hooks/useIsApp", () => ({
  useIsApp: jest.fn(),
}));

const mockedUseIsApp = jest.mocked(useIsApp);

describe("WebOnlyAdSlot", () => {
  it("앱 WebView에서는 광고와 광고 여백을 렌더하지 않습니다", () => {
    mockedUseIsApp.mockReturnValue(true);

    const { container } = render(
      <WebOnlyAdSlot>
        <div data-testid="home-ad" className="my-2" />
      </WebOnlyAdSlot>
    );

    expect(screen.queryByTestId("home-ad")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("일반 웹에서는 광고 배치를 유지합니다", () => {
    mockedUseIsApp.mockReturnValue(false);

    render(
      <WebOnlyAdSlot>
        <div data-testid="home-ad" className="my-2" />
      </WebOnlyAdSlot>
    );

    expect(screen.getByTestId("home-ad")).toHaveClass("my-2");
  });
});
