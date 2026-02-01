/**
 * @jest-environment node
 */
import { generateRecipeMetadata } from "../recipeMetadata";
import {
  makeYoutubeFamousRecipe,
  makeYoutubeMediumRecipe,
  makeYoutubeStandardRecipe,
  makeBaseRecipe,
} from "./fixtures/recipeFactory";

describe("YouTube Recipe Metadata Generation", () => {
  describe("YouTube Famous (>10만 subscribers)", () => {
    it("제목에 채널명이 접두어로 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[백종원 레시피]");
      expect(meta.title).toContain("김치찌개");
    });

    it("설명에 구독자 수와 채널 정보가 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toContain("구독자 1.5만명");
      expect(meta.description).toContain("백종원");
      expect(meta.description).toContain("원본 영상의 핵심 내용을 정리");
    });

    it("YouTube 관련 키워드가 추가된다", () => {
      const recipe = makeYoutubeFamousRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      const keywords = meta.keywords as string[];
      expect(keywords).toContain("유튜브 레시피");
      expect(keywords).toContain("백종원 레시피");
      expect(keywords).toContain("유명 셰프");
      expect(keywords).toContain("김치찌개 유튜브");
    });

    it("레시피 이미지가 OpenGraph 이미지로 우선 사용된다", () => {
      const recipe = makeYoutubeFamousRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      const ogImages = meta.openGraph?.images as any[];
      expect(ogImages[0].url).toBe(recipe.imageUrl);
    });

    it("YouTube 썸네일이 OpenGraph 보조 이미지로 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        imageUrl: "https://example.com/recipe-image.jpg",
        youtubeThumbnailUrl: "https://img.youtube.com/vi/test/maxresdefault.jpg",
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      const ogImages = meta.openGraph?.images as any[];
      expect(ogImages).toHaveLength(2);
      expect(ogImages[0].url).toBe(recipe.imageUrl);
      expect(ogImages[1].url).toBe(recipe.youtubeThumbnailUrl);
    });

    it("구독자 100만 이상일 때 '유명 셰프' 키워드가 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        youtubeSubscriberCount: 2000000, // 200만
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      const keywords = meta.keywords as string[];
      expect(keywords).toContain("유명 셰프");
      expect(keywords).toContain("인기 유튜버");
      expect(keywords).toContain("백만 유튜버");
    });
  });

  describe("YouTube Medium (1만~10만 subscribers)", () => {
    it("제목에 '유튜브 레시피' 태그와 채널명이 포함된다", () => {
      const recipe = makeYoutubeMediumRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[유튜브 레시피]");
      expect(meta.title).toContain("요리왕비룡");
    });

    it("설명에 채널 정보가 포함된다", () => {
      const recipe = makeYoutubeMediumRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toContain("요리왕비룡 채널의");
      expect(meta.description).toContain("구독자 4만명");
    });

    it("YouTube 관련 키워드가 추가된다", () => {
      const recipe = makeYoutubeMediumRecipe({
        youtubeSubscriberCount: 150000, // 15만 (100K 이상)
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      const keywords = meta.keywords as string[];
      expect(keywords).toContain("유튜브 레시피");
      expect(keywords).toContain("요리왕비룡 레시피");
      expect(keywords).toContain("인기 요리 채널");
    });

    it("구독자 수가 정확히 포맷되어 표시된다", () => {
      const recipe = makeYoutubeMediumRecipe({
        youtubeSubscriberCount: 45000, // 4.5만
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toContain("구독자 4만명");
    });
  });

  describe("YouTube Standard (<1만 subscribers)", () => {
    it("제목에 채널명이 접미어로 포함된다", () => {
      const recipe = makeYoutubeStandardRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[집밥요정]");
      expect(meta.title).toContain("김치찌개");
    });

    it("설명에 채널 이름만 포함된다", () => {
      const recipe = makeYoutubeStandardRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toContain("집밥요정 채널의");
      expect(meta.description).toContain("구독자 5천명");
    });

    it("YouTube 기본 키워드가 포함된다", () => {
      const recipe = makeYoutubeStandardRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      const keywords = meta.keywords as string[];
      expect(keywords).toContain("유튜브 레시피");
      expect(keywords).toContain("집밥요정 레시피");
    });
  });

  describe("Edge Cases", () => {
    it("YouTube URL만 있고 채널명이 없으면 일반 레시피로 처리된다", () => {
      const recipe = makeBaseRecipe({
        youtubeUrl: "https://youtube.com/watch?v=test",
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).not.toContain("유튜브");
      const keywords = meta.keywords as string[];
      expect(keywords).not.toContain("유튜브 레시피");
    });

    it("구독자 수가 0이면 구독자 정보가 설명에 포함되지 않는다", () => {
      const recipe = makeYoutubeStandardRecipe({
        youtubeSubscriberCount: 0,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toContain("집밥요정 채널의");
      expect(meta.description).not.toContain("구독자");
    });

    it("구독자 수가 undefined면 구독자 정보가 설명에 포함되지 않는다", () => {
      const recipe = makeYoutubeStandardRecipe({
        youtubeSubscriberCount: undefined,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toContain("집밥요정 채널의");
      expect(meta.description).not.toContain("구독자");
    });

    it("YouTube 썸네일이 없으면 레시피 이미지를 사용한다", () => {
      const recipe = makeYoutubeStandardRecipe({
        youtubeThumbnailUrl: undefined,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      const ogImages = meta.openGraph?.images as any[];
      expect(ogImages[0].url).toBe(recipe.imageUrl);
    });

    it("비디오 제목이 없어도 메타데이터 생성에 실패하지 않는다", () => {
      const recipe = makeYoutubeStandardRecipe({
        youtubeVideoTitle: undefined,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.description).toBeDefined();
      expect(meta.title).toBeDefined();
    });

    it("YouTube 썸네일과 레시피 이미지가 같으면 보조 이미지를 추가하지 않는다", () => {
      const sameImageUrl = "https://example.com/same-image.jpg";
      const recipe = makeYoutubeFamousRecipe({
        imageUrl: sameImageUrl,
        youtubeThumbnailUrl: sameImageUrl,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      const ogImages = meta.openGraph?.images as any[];
      expect(ogImages).toHaveLength(1);
      expect(ogImages[0].url).toBe(sameImageUrl);
    });
  });

  describe("Chef Recipe Priority", () => {
    it("'셰프 레시피' 태그가 있으면 YouTube 정보보다 우선한다", () => {
      const recipe = makeYoutubeFamousRecipe({
        tags: ["셰프 레시피"],
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[15분 레시피]");
      expect(meta.description).toContain("흑백요리사");

      const keywords = meta.keywords as string[];
      expect(keywords).toContain("흑백요리사");
    });

    it("제목에 '흑백요리사'가 포함되면 셰프 레시피로 처리된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        title: "흑백요리사 김치찌개",
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[15분 레시피]");
      expect(meta.description).toContain("흑백요리사");
      expect(meta.description).toContain("냉장고를 부탁해");
    });
  });

  describe("Cost-based Title Keywords", () => {
    it("재료비 5천원 이하면 '[천원]' 키워드가 제목에 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        totalIngredientCost: 3000,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[3천원]");
    });

    it("재료비 5천~1만원이면 '[만원요리]' 키워드가 제목에 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        totalIngredientCost: 7000,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[만원요리]");
    });

    it("재료비 1만원 초과면 비용 키워드가 제목에 포함되지 않는다", () => {
      const recipe = makeYoutubeFamousRecipe({
        totalIngredientCost: 15000,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).not.toContain("천원");
      expect(meta.title).not.toContain("만원요리");
    });
  });

  describe("Time-based Title Keywords", () => {
    it("조리시간 15분 이하면 '[15분컷]' 키워드가 제목에 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        cookingTime: 10,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[15분컷]");
    });

    it("조리시간 16~30분이면 '[초간단]' 키워드가 제목에 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        cookingTime: 25,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).toContain("[초간단]");
    });

    it("조리시간 30분 초과면 시간 키워드가 제목에 포함되지 않는다", () => {
      const recipe = makeYoutubeFamousRecipe({
        cookingTime: 45,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      expect(meta.title).not.toContain("15분컷");
      expect(meta.title).not.toContain("초간단");
    });
  });

  describe("Canonical URL", () => {
    it("올바른 canonical URL이 생성된다", () => {
      const recipe = makeYoutubeFamousRecipe();
      const meta = generateRecipeMetadata(recipe, "test-recipe-123");

      expect(meta.alternates?.canonical).toBe(
        "https://www.recipio.kr/recipes/test-recipe-123"
      );
    });
  });

  describe("Twitter Metadata", () => {
    it("Twitter 카드에 레시피 이미지가 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe();
      const meta = generateRecipeMetadata(recipe, "test-id");

      const twitterImages = meta.twitter?.images as string[];
      expect(twitterImages[0]).toBe(recipe.imageUrl);
    });

    it("YouTube 썸네일과 레시피 이미지가 다르면 둘 다 포함된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        imageUrl: "https://example.com/recipe-image.jpg",
        youtubeThumbnailUrl: "https://img.youtube.com/vi/test/maxresdefault.jpg",
      });
      const meta = generateRecipeMetadata(recipe, "test-id");

      const twitterImages = meta.twitter?.images as string[];
      expect(twitterImages).toHaveLength(2);
      expect(twitterImages[0]).toBe(recipe.imageUrl);
      expect(twitterImages[1]).toBe(recipe.youtubeThumbnailUrl);
    });
  });
});
