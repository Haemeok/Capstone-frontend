import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import { getPlaceholders, MAX_PLACEHOLDER_CHARS } from "../SearchInput";

describe("getPlaceholders", () => {
  it("T-07: locale·시간대 버킷 선택", () => {
    expect(getPlaceholders("ja", 8)).toBe(
      searchDiscoveryMessages.ja.placeholders.breakfast
    );
    expect(getPlaceholders("ja", 13)).toBe(
      searchDiscoveryMessages.ja.placeholders.lunch
    );
    expect(getPlaceholders("ja", 20)).toBe(
      searchDiscoveryMessages.ja.placeholders.dinner
    );
    expect(getPlaceholders("ko", 5)).toBe(
      searchDiscoveryMessages.ko.placeholders.breakfast
    );
    expect(getPlaceholders("ko", 11)).toBe(
      searchDiscoveryMessages.ko.placeholders.lunch
    );
    expect(getPlaceholders("ko", 17)).toBe(
      searchDiscoveryMessages.ko.placeholders.dinner
    );
  });

  it("T-08: ja·en placeholder에 한글 없음, ko엔 있음", () => {
    const hangul = /[가-힣]/;
    const all = (l: "ja" | "en") => [
      ...searchDiscoveryMessages[l].placeholders.breakfast,
      ...searchDiscoveryMessages[l].placeholders.lunch,
      ...searchDiscoveryMessages[l].placeholders.dinner,
    ];
    expect(all("ja").some((s) => hangul.test(s))).toBe(false);
    expect(all("en").some((s) => hangul.test(s))).toBe(false);
    expect(
      searchDiscoveryMessages.ko.placeholders.breakfast.some((s) =>
        hangul.test(s)
      )
    ).toBe(true);
  });

  it("T-09: 모든 locale placeholder가 글자수 예산 내", () => {
    (["ko", "ja", "en"] as const).forEach((l) => {
      const all = [
        ...searchDiscoveryMessages[l].placeholders.breakfast,
        ...searchDiscoveryMessages[l].placeholders.lunch,
        ...searchDiscoveryMessages[l].placeholders.dinner,
      ];
      const over = all.filter((s) => s.length > MAX_PLACEHOLDER_CHARS[l]);
      expect(over).toEqual([]);
    });
  });
});
