import { ApiError } from "@/shared/api/errors";
import { mapJobFailureMessage, toYoutubeImportError } from "../errors";

describe("toYoutubeImportError", () => {
  describe("에러 코드별 메시지 변환", () => {
    it("907 에러 → 유튜브 링크만 가능해요", () => {
      const error = new ApiError(400, "Bad Request", {
        code: 907,
        message: "지원하지 않는 URL 형식입니다.",
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("유튜브 링크만 가능해요");
      expect(result.code).toBe(907);
    });

    it("901 에러 → 서버 메시지 그대로", () => {
      const serverMessage = "레시피 영상이 아닙니다: 단순 먹방 영상입니다.";
      const error = new ApiError(400, "Bad Request", {
        code: 901,
        message: serverMessage,
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe(serverMessage);
    });

    it("701 에러 → 일시적 오류 메시지", () => {
      const error = new ApiError(500, "Internal Server Error", {
        code: 701,
        message: "AI 레시피 생성에 실패했습니다.",
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe(
        "일시적 오류입니다. 잠시 후 다시 시도해 주세요"
      );
    });
  });

  describe("429 에러 retryAfter 처리", () => {
    it("retryAfter 없음 → 내일 다시 시도해주세요", () => {
      const error = new ApiError(429, "Too Many Requests", {
        code: 429,
        message: "하루 생성 제한을 초과했습니다.",
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("내일 다시 시도해주세요");
    });

    it("retryAfter 1시간 이하 → 잠시 후 다시 시도해주세요", () => {
      const error = new ApiError(429, "Too Many Requests", {
        code: 429,
        message: "하루 생성 제한을 초과했습니다.",
        retryAfter: 30 * 60 * 1000, // 30분
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("잠시 후 다시 시도해주세요");
    });

    it("retryAfter 5시간 → 5시간 후 다시 시도해주세요", () => {
      const error = new ApiError(429, "Too Many Requests", {
        code: 429,
        message: "하루 생성 제한을 초과했습니다.",
        retryAfter: 5 * 60 * 60 * 1000, // 5시간
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("5시간 후 다시 시도해주세요");
      expect(result.retryAfter).toBe(5 * 60 * 60 * 1000);
    });

    it("retryAfter 24시간 이상 → 내일 다시 시도해주세요", () => {
      const error = new ApiError(429, "Too Many Requests", {
        code: 429,
        message: "하루 생성 제한을 초과했습니다.",
        retryAfter: 25 * 60 * 60 * 1000, // 25시간
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("내일 다시 시도해주세요");
    });
  });

  describe("폴백 처리", () => {
    it("알 수 없는 에러 코드 → 서버 메시지 사용", () => {
      const error = new ApiError(400, "Bad Request", {
        code: 999,
        message: "알 수 없는 에러입니다.",
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("알 수 없는 에러입니다.");
    });

    it("ApiError without data → HTTP 상태 기반 메시지", () => {
      const error = new ApiError(500, "Internal Server Error");
      const result = toYoutubeImportError(error);
      expect(result.message).toBe(
        "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    });

    it("일반 Error → 기본 메시지", () => {
      const error = new Error("Network failed");
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("알 수 없는 오류가 발생했습니다");
    });

    it("unknown 타입 → 기본 메시지", () => {
      const result = toYoutubeImportError(null);
      expect(result.message).toBe("알 수 없는 오류가 발생했습니다");
    });
  });

  describe("문자열 코드 처리", () => {
    it("code가 문자열이어도 정상 변환", () => {
      const error = new ApiError(400, "Bad Request", {
        code: "907",
        message: "지원하지 않는 URL 형식입니다.",
      });
      const result = toYoutubeImportError(error);
      expect(result.message).toBe("유튜브 링크만 가능해요");
      expect(result.code).toBe(907);
    });
  });
});

describe("mapJobFailureMessage", () => {
  it("code 901 → API 메시지를 그대로 반환", () => {
    const result = mapJobFailureMessage({
      code: "901",
      message: "레시피 아님: 예능/토크 - 조리법 없음",
    });
    expect(result).toBe("레시피 아님: 예능/토크 - 조리법 없음");
  });

  it("code 907 → 유튜브 링크 전용 메시지", () => {
    const result = mapJobFailureMessage({
      code: "907",
      message: "Unsupported URL",
    });
    expect(result).toBe("유튜브 링크만 가능해요");
  });

  it("code 701 → AI 생성 실패 메시지", () => {
    const result = mapJobFailureMessage({
      code: "701",
      message: "AI generation failed",
    });
    expect(result).toBe("일시적 오류입니다. 잠시 후 다시 시도해 주세요");
  });

  it("code 429 retryAfter 없음 → 내일 다시 시도해주세요", () => {
    const result = mapJobFailureMessage({
      code: "429",
      message: "Rate limit exceeded",
    });
    expect(result).toBe("내일 다시 시도해주세요");
  });

  it("code 429 retryAfter 1시간 이내 → 잠시 후 다시 시도해주세요", () => {
    const result = mapJobFailureMessage({
      code: "429",
      message: "Rate limit exceeded",
      retryAfter: 1000 * 60 * 30,
    });
    expect(result).toBe("잠시 후 다시 시도해주세요");
  });

  it("code 429 retryAfter 5시간 → 5시간 후 다시 시도해주세요", () => {
    const result = mapJobFailureMessage({
      code: "429",
      message: "Rate limit exceeded",
      retryAfter: 1000 * 60 * 60 * 5,
    });
    expect(result).toBe("5시간 후 다시 시도해주세요");
  });

  it("알 수 없는 code → API 메시지를 그대로 반환", () => {
    const result = mapJobFailureMessage({
      code: "999",
      message: "Unknown error occurred",
    });
    expect(result).toBe("Unknown error occurred");
  });

  it("code 없음 → message 반환", () => {
    const result = mapJobFailureMessage({
      message: "추출에 실패했습니다.",
    });
    expect(result).toBe("추출에 실패했습니다.");
  });

  it("code, message 모두 없음 → 기본 메시지", () => {
    const result = mapJobFailureMessage({});
    expect(result).toBe("알 수 없는 오류가 발생했습니다");
  });
});
