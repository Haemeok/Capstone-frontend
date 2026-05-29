// src/app/admin/card-news-grid/lib/schema.test.ts
import {
  DEFAULT_MODEL_ID,
  itemsSchema,
  MAX_CAPTION,
  MAX_DISH_NAME,
  MAX_IMAGE_PROMPT,
  MODEL_OPTIONS,
  topicsSchema,
  truncate,
} from "./schema";

describe("MODEL_OPTIONS", () => {
  it("기본 모델은 gpt-5.5이고 옵션에 포함된다", () => {
    expect(DEFAULT_MODEL_ID).toBe("openai/gpt-5.5");
    expect(MODEL_OPTIONS.map((m) => m.id)).toContain(DEFAULT_MODEL_ID);
  });
});

describe("itemsSchema", () => {
  const item = {
    dishName: "김치찌개",
    caption: "물 2:고춧가루 1 황금비율",
    imagePrompt: "점토 김치찌개 한 그릇",
  };
  const items = Array.from({ length: 9 }, () => item);

  it("items 9개 + header는 통과", () => {
    expect(itemsSchema.safeParse({ header: "토마토케찹 황금비율", items }).success).toBe(true);
  });

  it("items가 9개가 아니면 실패", () => {
    expect(itemsSchema.safeParse({ header: "x", items: items.slice(0, 8) }).success).toBe(false);
  });

  it("caption 길이 상한 초과 시 실패", () => {
    const longCaption = "가".repeat(MAX_CAPTION + 1);
    const bad = [{ dishName: "김치찌개", caption: longCaption, imagePrompt: "ok" }, ...items.slice(1)];
    expect(itemsSchema.safeParse({ header: "x", items: bad }).success).toBe(false);
  });

  it("dishName 길이 상한 초과 시 실패", () => {
    const longName = "가".repeat(MAX_DISH_NAME + 1);
    const bad = [{ dishName: longName, caption: "ok", imagePrompt: "ok" }, ...items.slice(1)];
    expect(itemsSchema.safeParse({ header: "x", items: bad }).success).toBe(false);
  });

  it("imagePrompt 누락 시 실패", () => {
    const bad = Array.from({ length: 9 }, () => ({ dishName: "김치찌개", caption: "ok" }));
    expect(itemsSchema.safeParse({ header: "x", items: bad }).success).toBe(false);
  });

  it("imagePrompt 빈 문자열 시 실패", () => {
    const bad = Array.from({ length: 9 }, () => ({ dishName: "김치찌개", caption: "ok", imagePrompt: "" }));
    expect(itemsSchema.safeParse({ header: "x", items: bad }).success).toBe(false);
  });

  it("MAX_IMAGE_PROMPT는 양수이다", () => {
    expect(MAX_IMAGE_PROMPT).toBeGreaterThan(0);
  });
});

describe("topicsSchema", () => {
  it("topics 5개는 통과", () => {
    const topics = Array.from({ length: 5 }, () => ({ title: "주제", concept: "한 줄 설명" }));
    expect(topicsSchema.safeParse({ topics }).success).toBe(true);
  });
});

describe("truncate", () => {
  it("상한 초과 시 … 로 자른다", () => {
    expect(truncate("가나다라마", 3)).toBe("가나…");
  });
  it("상한 이하는 그대로", () => {
    expect(truncate("가나", 3)).toBe("가나");
  });
});
