import { parseAppToWebMessage } from "../appMessageGuard";

describe("parseAppToWebMessage", () => {
  it("object가 아니거나 알 수 없는 type은 null", () => {
    expect(parseAppToWebMessage(null)).toBeNull();
    expect(parseAppToWebMessage("x")).toBeNull();
    expect(parseAppToWebMessage(42)).toBeNull();
    expect(parseAppToWebMessage({ type: "UNKNOWN", payload: {} })).toBeNull();
    expect(parseAppToWebMessage({ payload: {} })).toBeNull();
  });

  describe("NOTIFICATION_STATUS", () => {
    it("유효한 status는 통과", () => {
      const msg = {
        type: "NOTIFICATION_STATUS",
        payload: { status: "granted" },
      };
      expect(parseAppToWebMessage(msg)).toEqual(msg);
    });
    it("status가 허용값 밖이거나 없으면 null", () => {
      expect(
        parseAppToWebMessage({
          type: "NOTIFICATION_STATUS",
          payload: { status: "weird" },
        })
      ).toBeNull();
      expect(
        parseAppToWebMessage({ type: "NOTIFICATION_STATUS", payload: {} })
      ).toBeNull();
      expect(parseAppToWebMessage({ type: "NOTIFICATION_STATUS" })).toBeNull();
    });
  });

  describe("AUTH_DIAG", () => {
    it("phase/source/diagId 문자열이면 통과(meta 선택)", () => {
      const msg = {
        type: "AUTH_DIAG",
        payload: { phase: "start", source: "app", diagId: "d1" },
      };
      expect(parseAppToWebMessage(msg)).toEqual(msg);
    });
    it("필수 문자열 필드가 빠지면 null", () => {
      expect(
        parseAppToWebMessage({
          type: "AUTH_DIAG",
          payload: { phase: "start", source: "app" },
        })
      ).toBeNull();
    });
  });

  describe("KEYBOARD_STATE", () => {
    it("v=1, state 문자열, height 숫자면 통과", () => {
      const msg = {
        type: "KEYBOARD_STATE",
        payload: { v: 1, state: "did-show", height: 260, duration: 250 },
      };
      expect(parseAppToWebMessage(msg)).toEqual(msg);
    });
    it("height가 숫자가 아니면 null", () => {
      expect(
        parseAppToWebMessage({
          type: "KEYBOARD_STATE",
          payload: { v: 1, state: "did-show", height: "260" },
        })
      ).toBeNull();
    });
  });

  describe("APP_CONTEXT", () => {
    const valid = {
      type: "APP_CONTEXT",
      payload: {
        v: 1,
        isNativeApp: true,
        appVersion: "1.2.3",
        platform: "ios",
        osVersion: "17.0",
        deviceModel: "iPhone",
        pushPermission: "granted",
        locale: "ko-KR",
      },
    };
    it("모든 필드가 맞으면 통과", () => {
      expect(parseAppToWebMessage(valid)).toEqual(valid);
    });
    it("platform이 허용값 밖이면 null", () => {
      expect(
        parseAppToWebMessage({
          ...valid,
          payload: { ...valid.payload, platform: "windows" },
        })
      ).toBeNull();
    });
  });
});
