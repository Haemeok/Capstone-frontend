import { render, screen } from "@testing-library/react";

import { RootShell } from "../RootShell";

let mockPathname = "/ad-report";
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));
jest.mock("next/dynamic", () => () => {
  const MockServiceShell = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="service-shell">{children}</div>
  );
  return MockServiceShell;
});

describe("리포트 전용 레이아웃", () => {
  it("리포트 직접 진입은 서비스 provider와 광고 영역을 마운트하지 않는다", () => {
    mockPathname = "/ad-report";
    render(
      <RootShell>
        <div>리포트 내용</div>
      </RootShell>
    );
    expect(screen.getByText("리포트 내용")).toBeInTheDocument();
    expect(screen.queryByTestId("service-shell")).not.toBeInTheDocument();
  });
  it("기존 서비스 경로는 공통 레이아웃을 유지한다", () => {
    mockPathname = "/recipes/abc";
    render(
      <RootShell>
        <div>레시피 내용</div>
      </RootShell>
    );
    expect(screen.getByTestId("service-shell")).toHaveTextContent(
      "레시피 내용"
    );
  });
});
