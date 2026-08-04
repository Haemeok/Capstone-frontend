/**
 * @jest-environment node
 */
import { generateLocalizedRecipeMetadata } from "../localizedRecipeMetadata";
import { generateRecipeMetadata } from "../recipeMetadata";
import { normalizeAuthorName, withAuthorSuffix } from "../titleAuthor";
import {
  makeBaseRecipe,
  makeYoutubeFamousRecipe,
  makeYoutubeMediumRecipe,
} from "./fixtures/recipeFactory";

const OFFICIAL_AUTHOR = {
  id: "Kelb9q6w",
  nickname: "레시피오",
  profileImage: "https://example.com/official.jpg",
  hasFirstRecord: false,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

describe("작성자 접미 — 예산이 남을 때만 제목 뒤에 붙는다", () => {
  it("T-40: 예산이 남으면 닉네임이 by 접미로 붙는다", () => {
    const recipe = makeBaseRecipe({ tags: ["한식"] });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toBe(
      "[초간단⚡] 김치찌개 30분 완성 by 요리왕 | 레시피오"
    );
  });

  it("T-41: 25자 예산을 넘기면 접미가 붙지 않는다", () => {
    const recipe = makeBaseRecipe({
      title: "고기집 스타일 5분 완성 된장찌개",
      tags: ["한식"],
      cookingTime: 15,
      totalIngredientCost: 4345,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).not.toContain("by");
    expect(meta.title).toBe(
      "[4천원💰] 고기집 스타일 5분 완성 된장찌개 | 레시피오"
    );
  });

  it("T-42: 공식 계정 레시피는 닉네임을 붙이지 않는다", () => {
    const recipe = makeBaseRecipe({ tags: ["한식"], author: OFFICIAL_AUTHOR });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toBe("[초간단⚡] 김치찌개 30분 완성 | 레시피오");
  });

  it("T-43: 유튜브 레시피는 닉네임 대신 채널명을 쓴다", () => {
    const recipe = makeYoutubeMediumRecipe({
      title: "떡볶이",
      tags: ["한식"],
      cookingTime: 45,
      totalIngredientCost: 800,
      author: OFFICIAL_AUTHOR,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toBe("떡볶이 by 요리왕비룡 | 레시피오");
  });

  it("T-44: 채널명 접두가 이미 붙은 제목에는 중복으로 붙지 않는다", () => {
    const recipe = makeYoutubeFamousRecipe({
      title: "김치찌개",
      tags: ["한식"],
      cookingTime: 45,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.title).toBe("백종원 김치찌개 | 레시피오");
  });

  it("T-45: 공유 카드(og/twitter) 제목도 같은 접미를 쓴다", () => {
    const recipe = makeBaseRecipe({ tags: ["한식"] });
    const meta = generateRecipeMetadata(recipe, "test-id");

    expect(meta.openGraph?.title).toBe(
      "[초간단⚡] 김치찌개 30분 완성 by 요리왕"
    );
    expect(meta.twitter?.title).toBe("[초간단⚡] 김치찌개 30분 완성 by 요리왕");
  });
});

describe("normalizeAuthorName", () => {
  it("T-46: 한글 토큰이 있으면 라틴 핸들을 버린다", () => {
    expect(normalizeAuthorName("오인스 saedek_oins")).toBe("오인스");
  });

  it("T-47: 한글이 없으면 핸들이 아닌 토큰만 남긴다", () => {
    expect(normalizeAuthorName("Spain on a Fork")).toBe("Spain on a Fork");
    expect(normalizeAuthorName("@handle_only")).toBeNull();
  });
});

describe("withAuthorSuffix", () => {
  it("T-48: 제목이 이미 작성자를 포함하면 그대로 둔다", () => {
    expect(withAuthorSuffix("백종원 김치찌개", "백종원", 25)).toBe(
      "백종원 김치찌개"
    );
  });

  it("T-49: 예산과 정확히 같으면 붙인다", () => {
    expect(withAuthorSuffix("김치찌개", "요리왕", 11)).toBe(
      "김치찌개 by 요리왕"
    );
    expect(withAuthorSuffix("김치찌개", "요리왕", 10)).toBe("김치찌개");
  });
});

describe("ja/en 제목에도 같은 접미가 붙는다", () => {
  it("T-50: ja는 25자 예산으로 작성자를 붙인다", () => {
    const recipe = makeBaseRecipe({
      title: "キムチチゲ",
      description: "うまい",
      isIndexed: true,
    });
    const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
      locale: "ja",
      translated: true,
    });

    expect(meta.title).toBe("キムチチゲ by 요리왕 | レシピオ");
    expect(meta.openGraph?.title).toBe("キムチチゲ by 요리왕");
  });

  it("T-51: en은 55자 예산을 쓴다", () => {
    const recipe = makeBaseRecipe({
      title: "Kimchi Stew with Pork Belly",
      description: "spicy stew",
      isIndexed: true,
    });
    const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
      locale: "en",
      translated: true,
    });

    expect(meta.title).toBe("Kimchi Stew with Pork Belly by 요리왕 | Recipio");
  });

  it("T-52: ja 공식 계정 레시피는 접미가 없다", () => {
    const recipe = makeBaseRecipe({
      title: "キムチチゲ",
      description: "うまい",
      isIndexed: true,
      author: OFFICIAL_AUTHOR,
    });
    const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
      locale: "ja",
      translated: true,
    });

    expect(meta.title).toBe("キムチチゲ | レシピオ");
  });
});
