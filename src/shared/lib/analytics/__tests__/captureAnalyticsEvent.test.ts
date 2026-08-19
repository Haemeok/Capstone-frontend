describe("captureAnalyticsEvent", () => {
  it("PostHog 초기화 전에 발생한 이벤트를 클라이언트 등록 후 전달합니다", async () => {
    const { captureAnalyticsEvent, registerAnalyticsClient } =
      await import("../captureAnalyticsEvent");
    const capture = jest.fn();

    captureAnalyticsEvent("monthly_share_capture_diagnostic", {
      sourceStickerCount: 10,
    });
    registerAnalyticsClient({ capture });

    expect(capture).toHaveBeenCalledWith("monthly_share_capture_diagnostic", {
      sourceStickerCount: 10,
    });
  });
});
