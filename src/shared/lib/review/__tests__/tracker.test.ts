import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { trackReviewAction, checkAndTriggerReviewGate } from "../tracker";

describe("trackReviewAction", () => {
  beforeEach(() => {
    localStorage.clear();
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

  it("임계값 미달이면 카운트만 증가해야 함", () => {
    trackReviewAction("recipe_save");
    trackReviewAction("recipe_save");
    trackReviewAction("youtube_extract");
    trackReviewAction("ai_generation");

    expect(localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTED)).toBeNull();
  });

  it("REVIEW_REQUESTED 플래그가 이미 설정된 상태에서는 카운트를 증가시키지 않아야 함", () => {
    localStorage.setItem(STORAGE_KEYS.REVIEW_REQUESTED, "true");

    trackReviewAction("recipe_save");

    expect(
      localStorage.getItem(STORAGE_KEYS.REVIEW_ACTION_RECIPE_SAVE)
    ).toBeNull();
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
});

describe("checkAndTriggerReviewGate", () => {
  let mockOnShouldShow: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    mockOnShouldShow = jest.fn();
  });

  it("recipe_save 임계값(5회)에 도달하면 콜백을 호출해야 함", () => {
    for (let i = 0; i < 5; i++) {
      trackReviewAction("recipe_save");
    }

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).toHaveBeenCalledTimes(1);
  });

  it("youtube_extract 임계값(3회)에 도달하면 콜백을 호출해야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("youtube_extract");
    }

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).toHaveBeenCalledTimes(1);
  });

  it("ai_generation 임계값(3회)에 도달하면 콜백을 호출해야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("ai_generation");
    }

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).toHaveBeenCalledTimes(1);
  });

  it("cooking_complete 임계값(3회)에 도달하면 콜백을 호출해야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("cooking_complete");
    }

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).toHaveBeenCalledTimes(1);
  });

  it("임계값 미달이면 콜백을 호출하지 않아야 함", () => {
    trackReviewAction("recipe_save");
    trackReviewAction("youtube_extract");

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).not.toHaveBeenCalled();
  });

  it("OR 연산: 하나의 액션만 임계값에 도달해도 콜백을 호출해야 함", () => {
    trackReviewAction("recipe_save");
    trackReviewAction("youtube_extract");
    trackReviewAction("youtube_extract");
    trackReviewAction("youtube_extract"); // 3회 도달

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).toHaveBeenCalledTimes(1);
  });

  it("REVIEW_REQUESTED 플래그가 이미 설정되어 있으면 콜백을 호출하지 않아야 함", () => {
    for (let i = 0; i < 3; i++) {
      trackReviewAction("cooking_complete");
    }
    localStorage.setItem(STORAGE_KEYS.REVIEW_REQUESTED, "true");

    checkAndTriggerReviewGate(mockOnShouldShow);

    expect(mockOnShouldShow).not.toHaveBeenCalled();
  });
});
