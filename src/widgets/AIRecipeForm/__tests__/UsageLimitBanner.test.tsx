import { render, screen } from "@testing-library/react";
import UsageLimitBanner from "../UsageLimitBanner";

describe("UsageLimitBanner", () => {
  it("기본 메시지와 서브 메시지를 렌더링해야 함", () => {
    render(<UsageLimitBanner />);

    expect(
      screen.getByText(/AI 레시피 생성 횟수를 모두 사용했어요/)
    ).toBeInTheDocument();
    expect(screen.getByText(/내일 다시 시도해주세요/)).toBeInTheDocument();
  });

  it("커스텀 메시지를 렌더링해야 함", () => {
    const customMessage = "유튜브 레시피 추출 횟수를 모두 사용했어요.";
    render(<UsageLimitBanner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("커스텀 서브 메시지를 렌더링해야 함", () => {
    const customSubMessage = "잠시 후 다시 시도해주세요.";
    render(<UsageLimitBanner subMessage={customSubMessage} />);

    expect(screen.getByText(customSubMessage)).toBeInTheDocument();
  });
});
