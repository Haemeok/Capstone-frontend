import { render, screen } from "@testing-library/react";

import { AdFreeActiveNotice } from "../AdFreeActiveNotice";

describe("AdFreeActiveNotice", () => {
  it("이용 중 문구와 남은 일수를 한 줄로 보여준다", () => {
    render(
      <AdFreeActiveNotice
        remaining={2 * 86400000}
        adFreeUntil="2026-06-28T12:00:00.000Z"
      />
    );

    expect(screen.getByText(/광고 없이 이용 중/)).toBeInTheDocument();
    expect(screen.getByText(/2일 남음/)).toBeInTheDocument();
    expect(screen.getByText(/월 .*까지/)).toBeInTheDocument();
  });

  it("하루 미만 남으면 오늘까지로 표시한다", () => {
    render(
      <AdFreeActiveNotice
        remaining={3600000}
        adFreeUntil="2026-06-28T12:00:00.000Z"
      />
    );

    expect(screen.getByText(/오늘까지/)).toBeInTheDocument();
  });
});
