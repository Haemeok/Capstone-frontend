/**
 * @jest-environment node
 */
import {
  createLandingFAQStructuredData,
  createTagItemListStructuredData,
} from "../schema";

describe("createLandingFAQStructuredData", () => {
  it("returns FAQPage with 6 questions", () => {
    const json = createLandingFAQStructuredData();

    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity).toHaveLength(6);
  });

  it("every entry is a Question with acceptedAnswer", () => {
    const json = createLandingFAQStructuredData();

    for (const entry of json.mainEntity) {
      expect(entry["@type"]).toBe("Question");
      expect(entry.name).toBeTruthy();
      expect(entry.acceptedAnswer["@type"]).toBe("Answer");
      expect(entry.acceptedAnswer.text).toBeTruthy();
    }
  });

  it("covers YouTube extraction as one of the questions", () => {
    const json = createLandingFAQStructuredData();
    const names = json.mainEntity.map((q) => q.name);
    expect(names.some((n) => n.includes("YouTube"))).toBe(true);
  });
});

describe("createTagItemListStructuredData", () => {
  it("returns ItemList with one entry per input tag", () => {
    const json = createTagItemListStructuredData([
      { code: "HOME_PARTY", name: "홈파티" },
      { code: "SOLO", name: "혼밥" },
    ]);

    expect(json["@type"]).toBe("ItemList");
    expect(json.itemListElement).toHaveLength(2);
  });

  it("builds absolute URLs with SITE_URL prefix and encoded tag code", () => {
    const json = createTagItemListStructuredData([
      { code: "HOME_PARTY", name: "홈파티" },
    ]);
    const item = json.itemListElement[0];
    expect(item["@type"]).toBe("ListItem");
    expect(item.position).toBe(1);
    expect(item.name).toBe("홈파티");
    expect(item.url).toMatch(/\/search\/results\?tags=HOME_PARTY$/);
    expect(item.url.startsWith("https://")).toBe(true);
  });
});
