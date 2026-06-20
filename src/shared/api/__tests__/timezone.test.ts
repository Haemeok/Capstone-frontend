/**
 * @jest-environment node
 */
import { getClientTimeZone } from "../timezone";

describe("getClientTimeZone", () => {
  afterEach(() => {
    // @ts-expect-error 클라 시뮬레이션 정리
    delete global.window;
    jest.restoreAllMocks();
  });

  it("T-204: window가 없으면 undefined를 반환한다 (throw 없음)", () => {
    expect(getClientTimeZone()).toBeUndefined();
  });

  it("T-204: 클라이언트에서 Intl 타임존을 반환한다", () => {
    // @ts-expect-error 클라 환경 시뮬레이션
    global.window = {};
    jest.spyOn(Intl, "DateTimeFormat").mockReturnValue({
      resolvedOptions: () => ({ timeZone: "America/New_York" }),
    } as unknown as Intl.DateTimeFormat);

    expect(getClientTimeZone()).toBe("America/New_York");
  });
});
