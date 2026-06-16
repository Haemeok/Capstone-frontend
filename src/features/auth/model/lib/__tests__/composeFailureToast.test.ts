import { composeFailureToast } from "../composeFailureToast";

const KO_TEMPLATE = "로그아웃에 실패했습니다: {message}";
const JA_TEMPLATE = "ログアウトに失敗しました: {message}";

describe("composeFailureToast", () => {
  it("non-Error 입력 시 unknown 폴백을 보간한다 (T-21)", () => {
    const result = composeFailureToast({
      template: JA_TEMPLATE,
      locale: "ja",
      error: "string error",
      unknownText: "不明なエラーが発生しました。",
    });
    expect(result).toBe(
      "ログアウトに失敗しました: 不明なエラーが発生しました。"
    );
  });

  it("ja + 한국어 서버 메시지여도 한글이 섞이지 않는다 (T-22)", () => {
    const result = composeFailureToast({
      template: JA_TEMPLATE,
      locale: "ja",
      error: new Error("토큰이 만료되었습니다"),
      unknownText: "不明なエラーが発生しました。",
    });
    expect(/[가-힣]/.test(result)).toBe(false);
  });

  it("ko + Error 시 서버 메시지를 그대로 보간한다 (T-23)", () => {
    const result = composeFailureToast({
      template: KO_TEMPLATE,
      locale: "ko",
      error: new Error("토큰 만료"),
      unknownText: "알 수 없는 오류가 발생했습니다.",
    });
    expect(result).toBe("로그아웃에 실패했습니다: 토큰 만료");
  });
});
