import { normalizeItems, normalizeTopics } from "./normalize";
import { MAX_CAPTION, MAX_DISH_NAME, MAX_HEADER } from "./schema";

const genItem = (
  over?: Partial<{ dishName: string; caption: string; imagePrompt: string }>
) => ({
  dishName: "불고기",
  caption: "간장 5:설탕 2",
  imagePrompt: "점토 불고기 한 그릇",
  ...over,
});

const nineItems = () => Array.from({ length: 9 }, () => genItem());

describe("normalizeItems", () => {
  it("정상 9개는 그대로 통과", () => {
    const res = normalizeItems({ header: "황금비율", items: nineItems() });
    expect(res.items).toHaveLength(9);
    expect(res.header).toBe("황금비율");
  });

  it("상한 초과 글자수는 truncate된다 (검증 탈락 대신 보정)", () => {
    const longCaption = "가".repeat(MAX_CAPTION + 20);
    const longName = "나".repeat(MAX_DISH_NAME + 5);
    const items = [
      genItem({ caption: longCaption, dishName: longName }),
      ...nineItems().slice(1),
    ];
    const res = normalizeItems({ header: "다".repeat(MAX_HEADER + 5), items });
    expect(res.items[0].caption.length).toBeLessThanOrEqual(MAX_CAPTION);
    expect(res.items[0].dishName.length).toBeLessThanOrEqual(MAX_DISH_NAME);
    expect(res.header.length).toBeLessThanOrEqual(MAX_HEADER);
  });

  it("9개 초과는 9개로 자른다", () => {
    const res = normalizeItems({
      header: "h",
      items: Array.from({ length: 12 }, () => genItem()),
    });
    expect(res.items).toHaveLength(9);
  });

  it("빈 필드 항목은 제거하고, 결과가 9개 미만이면 throw", () => {
    const items = [...nineItems().slice(0, 8), genItem({ caption: "  " })];
    expect(() => normalizeItems({ header: "h", items })).toThrow();
  });

  it("9개 미만이면 throw", () => {
    expect(() =>
      normalizeItems({ header: "h", items: nineItems().slice(0, 7) })
    ).toThrow();
  });
});

describe("normalizeTopics", () => {
  const genTopic = () => ({ title: "주제", concept: "한 줄 설명" });

  it("5개 초과는 5개로 자른다", () => {
    const res = normalizeTopics({
      topics: Array.from({ length: 8 }, () => genTopic()),
    });
    expect(res.topics).toHaveLength(5);
  });

  it("긴 title/concept은 truncate된다", () => {
    const res = normalizeTopics({
      topics: [
        { title: "가".repeat(MAX_HEADER + 10), concept: "나".repeat(80) },
      ],
    });
    expect(res.topics[0].title.length).toBeLessThanOrEqual(MAX_HEADER);
  });

  it("빈 title은 제거된다", () => {
    const res = normalizeTopics({
      topics: [{ title: "", concept: "x" }, genTopic()],
    });
    expect(res.topics).toHaveLength(1);
  });
});
