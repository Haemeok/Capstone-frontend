import { act, render, waitFor } from "@testing-library/react";

import { AdSlot } from "@/shared/adsense/AdSlot";

import { useUserStore } from "@/entities/user/model/store";
import { type User } from "@/entities/user/model/types";

import { AdsGateProvider } from "@/app/providers/AdsGateProvider";

jest.mock("@/shared/adsense/lib/isAdsEnabled", () => ({
  isAdsEnabled: () => true,
}));

const baseUser: User = {
  id: "u1",
  nickname: "t",
  profileImage: "",
  hasFirstRecord: false,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

describe("AdsGate × AdSlot (T-110)", () => {
  afterEach(() => act(() => useUserStore.setState({ user: null })));

  it("T-110: showAds=false면 AdSlot이 아무것도 렌더하지 않는다", () => {
    useUserStore.setState({
      user: {
        ...baseUser,
        adStatus: { showAds: false, adFreeUntil: "2026-09-05T00:00:00Z" },
      },
    });
    const { container } = render(
      <AdsGateProvider>
        <AdSlot slotId="x" minHeight={250} />
      </AdsGateProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("T-A8: showAds=true면 AdSlot이 ins를 렌더한다", async () => {
    act(() =>
      useUserStore.setState({
        user: { ...baseUser, adStatus: { showAds: true, adFreeUntil: null } },
      })
    );
    const { container } = render(
      <AdsGateProvider>
        <AdSlot slotId="x" minHeight={250} />
      </AdsGateProvider>
    );
    await waitFor(() =>
      expect(container.querySelector("ins.adsbygoogle")).not.toBeNull()
    );
  });
});
