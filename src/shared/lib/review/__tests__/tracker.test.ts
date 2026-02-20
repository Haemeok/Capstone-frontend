import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

const mockRequestAppReview = jest.fn();
jest.mock("@/shared/lib/bridge", () => ({
  requestAppReview: (...args: unknown[]) => mockRequestAppReview(...args),
}));

import { trackReviewAction } from "../tracker";

describe("trackReviewAction", () => {
  beforeEach(() => {
    localStorage.clear();
    mockRequestAppReview.mockClear();
  });

  it("카운트를 증가시키고 localStorage에 저장해야 함", () => {
    trackReviewAction("recipe_save");

    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_RECIPE_SAVE)).toBe(
      "1"
    );
  });

  it("여러 번 호출하면 카운트가 누적되어야 함", () => {
    trackReviewAction("ai_generation");
    trackReviewAction("ai_generation");

    expect(
      localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_AI_GENERATION)
    ).toBe("2");
  });

  it("recipe_save 임계값(5회)에 도달하면 리뷰를 요청해야 함", () => {
    for (let i = 0; i < 5; i++) {
      trackReviewAction("recipe_save");
    }

    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTED)).toBe("true");
  });

  it("youtube_extract 임계값(3회)에 도달하면 리뷰를 요청해야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("youtube_extract");
    }

    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTED)).toBe("true");
  });

  it("ai_generation 임계값(3회)에 도달하면 리뷰를 요청해야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("ai_generation");
    }

    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTED)).toBe("true");
  });

  it("cooking_complete 임계값(3회)에 도달하면 리뷰를 요청해야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("cooking_complete");
    }

    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTED)).toBe("true");
  });

  it("임계값 미달이면 리뷰를 요청하지 않아야 함", () => {
    trackReviewAction("recipe_save");
    trackReviewAction("recipe_save");
    trackReviewAction("youtube_extract");
    trackReviewAction("ai_generation");

    expect(mockRequestAppReview).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTED)).toBeNull();
  });

  it("OR 연산: 하나의 액션만 임계값에 도달해도 리뷰를 요청해야 함", () => {
    trackReviewAction("recipe_save");
    trackReviewAction("youtube_extract");
    trackReviewAction("youtube_extract");
    trackReviewAction("youtube_extract"); // 3회 도달

    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);
  });

  it("이미 리뷰 요청을 보낸 후에는 다시 보내지 않아야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("cooking_complete");
    }
    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);

    // 추가 액션 수행
    trackReviewAction("cooking_complete");
    trackReviewAction("recipe_save");
    trackReviewAction("ai_generation");

    expect(mockRequestAppReview).toHaveBeenCalledTimes(1);
  });

  it("리뷰 요청 후 카운트가 더 이상 증가하지 않아야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("ai_generation");
    }

    const countAfterReview = localStorage.getItem(
      STORAGE_KEYS.REVIEW_ACTION_AI_GENERATION
    );

    trackReviewAction("ai_generation");

    expect(
      localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_AI_GENERATION)
    ).toBe(countAfterReview);
  });

  it("서로 다른 액션의 카운트가 독립적으로 관리되어야 함", () => {
    trackReviewAction("recipe_save");
    trackReviewAction("youtube_extract");
    trackReviewAction("ai_generation");
    trackReviewAction("cooking_complete");

    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_RECIPE_SAVE)).toBe(
      "1"
    );
    expect(
      localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_YOUTUBE_EXTRACT)
    ).toBe("1");
    expect(
      localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_AI_GENERATION)
    ).toBe("1");
    expect(
      localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_COOKING_COMPLETE)
    ).toBe("1");
  });

  it("REVIEW_REQUESTED 플래그가 이미 설정된 상태에서는 아무 것도 하지 않아야 함", () => {
    localStorage.setItem(STORAGE_KEYS.REVIEW_REQUESTED, "true");

    trackReviewAction("recipe_save");

    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_RECIPE_SAVE)).toBeNull();
    expect(mockRequestAppReview).not.toHaveBeenCalled();
  });
});
