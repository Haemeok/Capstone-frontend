/**
 * @jest-environment node
 */
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import type { Locale } from "@/shared/i18n";

import {
  createLandingFAQStructuredData,
  createOrganizationStructuredData,
  createTagItemListStructuredData,
} from "../schema";

describe("createLandingFAQStructuredData", () => {
  it("returns a FAQPage with every entry shaped as a Question/Answer", () => {
    const json = createLandingFAQStructuredData();

    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity.length).toBeGreaterThan(0);

    for (const entry of json.mainEntity) {
      expect(entry["@type"]).toBe("Question");
      expect(entry.name).toBeTruthy();
      expect(entry.acceptedAnswer["@type"]).toBe("Answer");
      expect(entry.acceptedAnswer.text).toBeTruthy();
    }
  });

  it("serves the FAQ in the requested locale", () => {
    expect(createLandingFAQStructuredData("ja").mainEntity[0].name).toContain(
      "レシピオ"
    );
    expect(createLandingFAQStructuredData("en").mainEntity[0].name).toContain(
      "Recipio"
    );
  });

  it("surfaces Japan and US local recipes as a selling point in every locale", () => {
    const answers = (locale: Locale) =>
      createLandingFAQStructuredData(locale)
        .mainEntity.map((q) => q.acceptedAnswer.text)
        .join(" ");

    expect(answers("ko")).toMatch(/일본.*미국|미국.*일본/);
    expect(answers("ja")).toContain("アメリカ");
    expect(answers("en")).toMatch(/Japan[\s\S]*United States/);
  });
});

describe("createOrganizationStructuredData", () => {
  it("returns an Organization with absolute url/logo and store links in sameAs", () => {
    const json = createOrganizationStructuredData();

    expect(json["@type"]).toBe("Organization");
    expect(json.url.startsWith("https://")).toBe(true);
    expect(json.logo.startsWith("https://")).toBe(true);
    expect(json.sameAs).toContain(APP_STORE_URL);
    expect(json.sameAs).toContain(PLAY_STORE_URL);
  });

  it("describes the platform in the requested locale", () => {
    expect(createOrganizationStructuredData("ja").description).toContain(
      "レシピオ"
    );
    expect(createOrganizationStructuredData("en").description).toContain(
      "Recipio"
    );
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
