import { youtubeMessages } from "@/shared/i18n";
import { format } from "@/shared/i18n/format";

import { mapJobFailureMessage } from "../errors";

const LOCALES = ["ko", "en", "ja"] as const;
const hasHangul = (text: string): boolean => /[가-힣]/.test(text);

describe("mapJobFailureMessage", () => {
  it.each(LOCALES)("code 907 → dict[%s].errorUnsupportedUrl", (loc) => {
    const result = mapJobFailureMessage(
      { code: "907", message: "Unsupported URL" },
      youtubeMessages[loc]
    );
    expect(result).toBe(youtubeMessages[loc].errorUnsupportedUrl);
  });

  it.each(LOCALES)("code 701 → dict[%s].errorAiGenerationFailed", (loc) => {
    const result = mapJobFailureMessage(
      { code: "701", message: "AI generation failed" },
      youtubeMessages[loc]
    );
    expect(result).toBe(youtubeMessages[loc].errorAiGenerationFailed);
  });

  it.each(LOCALES)(
    "code 429 retryAfter 없음 → dict[%s].errorRateLimitTomorrow",
    (loc) => {
      const result = mapJobFailureMessage(
        { code: "429", message: "Rate limit exceeded" },
        youtubeMessages[loc]
      );
      expect(result).toBe(youtubeMessages[loc].errorRateLimitTomorrow);
    }
  );

  it.each(LOCALES)(
    "code 429 retryAfter 1시간 이내 → dict[%s].errorRateLimitSoon",
    (loc) => {
      const result = mapJobFailureMessage(
        { code: "429", message: "x", retryAfter: 1000 * 60 * 30 },
        youtubeMessages[loc]
      );
      expect(result).toBe(youtubeMessages[loc].errorRateLimitSoon);
    }
  );

  it.each(LOCALES)("code 429 retryAfter 5시간 → {hours} 보간 (%s)", (loc) => {
    const result = mapJobFailureMessage(
      { code: "429", message: "x", retryAfter: 1000 * 60 * 60 * 5 },
      youtubeMessages[loc]
    );
    expect(result).toBe(
      format(youtubeMessages[loc].errorRateLimitHours, { hours: 5 })
    );
  });

  it("code 901 → 서버 메시지를 그대로 반환 (백엔드 로컬라이즈 신뢰)", () => {
    const serverMessage = "레시피 아님: 예능/토크 - 조리법 없음";
    const result = mapJobFailureMessage(
      { code: "901", message: serverMessage },
      youtubeMessages.en
    );
    expect(result).toBe(serverMessage);
  });

  it("알 수 없는 code → 서버 메시지를 그대로 반환", () => {
    const result = mapJobFailureMessage(
      { code: "999", message: "Unknown error occurred" },
      youtubeMessages.en
    );
    expect(result).toBe("Unknown error occurred");
  });

  it.each(LOCALES)("code·message 모두 없음 → dict[%s].errorUnknown", (loc) => {
    const result = mapJobFailureMessage({}, youtubeMessages[loc]);
    expect(result).toBe(youtubeMessages[loc].errorUnknown);
  });

  it.each(["907", "701", "429"] as const)(
    "en 경로 code %s 메시지에 한국어가 없다 (누수 가드)",
    (code) => {
      const result = mapJobFailureMessage(
        { code, message: "x", retryAfter: 1000 * 60 * 60 * 5 },
        youtubeMessages.en
      );
      expect(hasHangul(result)).toBe(false);
    }
  );
});
