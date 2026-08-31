import { existsSync } from "node:fs";
import { join } from "node:path";

import { CATEGORY_ICON_CONFIG } from "@/shared/config/categoryNavigation";
import {
  TAG_DEFINITIONS,
  type TagCode,
} from "@/shared/config/constants/recipe";

const getImageClassName = (code: TagCode) =>
  CATEGORY_ICON_CONFIG[code].imageClassName;

describe("CATEGORY_ICON_CONFIG", () => {
  it("모든 레시피 카테고리를 하나의 배포 가능한 PNG 아이콘에 연결한다", () => {
    const tagCodes = TAG_DEFINITIONS.map(({ code }) => code).sort();
    const configuredCodes = Object.keys(CATEGORY_ICON_CONFIG).sort();

    expect(configuredCodes).toEqual(tagCodes);

    const imageSources = Object.values(CATEGORY_ICON_CONFIG).map(
      ({ imageSrc }) => imageSrc
    );

    expect(new Set(imageSources).size).toBe(TAG_DEFINITIONS.length);

    imageSources.forEach((imageSrc) => {
      expect(imageSrc).toMatch(/^\/images\/home-quick-nav\/[a-z-]+\.png$/);
      expect(existsSync(join(process.cwd(), "public", imageSrc))).toBe(true);
    });
  });

  it("홈 바로가기에서 검증된 기존 아이콘 중심 보정을 보존한다", () => {
    expect(CATEGORY_ICON_CONFIG.CHEF_RECIPE.imageClassName).toBe(
      "translate-x-[-4px] translate-y-[-4px]"
    );
    expect(CATEGORY_ICON_CONFIG.QUICK.imageClassName).toBe(
      "translate-x-[-3px] translate-y-[-5px]"
    );
    expect(CATEGORY_ICON_CONFIG.LATE_NIGHT.imageClassName).toBe(
      "translate-x-[4px] translate-y-[-5px]"
    );
    expect(CATEGORY_ICON_CONFIG.HEALTHY.imageClassName).toBe(
      "translate-x-[-4px] translate-y-[-2px]"
    );
    expect(CATEGORY_ICON_CONFIG.SOLO.imageClassName).toBe("translate-y-[-3px]");
    expect(CATEGORY_ICON_CONFIG.KIDS.imageClassName).toBe(
      "translate-x-[4px] translate-y-[-3px]"
    );
    expect(CATEGORY_ICON_CONFIG.HANGOVER.imageClassName).toBe(
      "translate-x-[-3px] translate-y-[6px]"
    );
    expect(CATEGORY_ICON_CONFIG.HOLIDAY.imageClassName).toBe(
      "translate-x-[2px] translate-y-[5px]"
    );
    expect(CATEGORY_ICON_CONFIG.AIR_FRYER.imageClassName).toBe(
      "translate-x-[6px] translate-y-[5px]"
    );
  });

  it("동적 카테고리 조회에서 선택적인 중심 보정을 일관되게 제공한다", () => {
    expect(getImageClassName("BRUNCH")).toBeUndefined();
    expect(getImageClassName("CHEF_RECIPE")).toBe(
      "translate-x-[-4px] translate-y-[-4px]"
    );
  });
});
