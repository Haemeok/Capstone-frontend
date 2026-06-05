import { fireEvent, render, screen } from "@testing-library/react";

import { useUserStore } from "@/entities/user/model/store";
import { type User } from "@/entities/user/model/types";

import { AdRemovalRow } from "../AdRemovalRow";

describe("광고 제거 설정 행", () => {
  afterEach(() => useUserStore.setState({ user: null }));

  it("T-511: 활성이면 카운트다운, 비활성이면 라벨", () => {
    useUserStore.setState({
      // 테스트 픽스처 — 행은 adStatus만 읽으므로 부분 User로 캐스트
      user: {
        adStatus: {
          showAds: false,
          adFreeUntil: new Date(Date.now() + 90000000).toISOString(),
        },
      } as User,
    });
    const { rerender } = render(<AdRemovalRow onOpenSheet={() => {}} />);
    expect(screen.getByText(/일 /)).toBeInTheDocument();

    useUserStore.setState({
      // 테스트 픽스처 — 비활성 상태(광고 노출)
      user: { adStatus: { showAds: true, adFreeUntil: null } } as User,
    });
    rerender(<AdRemovalRow onOpenSheet={() => {}} />);
    expect(screen.getByText("광고 없이 즐기기")).toBeInTheDocument();
  });

  it("T-510: 행을 누르면 onOpenSheet 콜백이 호출된다", () => {
    const onOpen = jest.fn();
    render(<AdRemovalRow onOpenSheet={onOpen} />);
    fireEvent.click(screen.getByText("광고 제거"));
    expect(onOpen).toHaveBeenCalled();
  });
});
