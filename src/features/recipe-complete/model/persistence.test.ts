import {
  loadCompletedRecipes,
  addCompletedRecipeRecord,
  clearCompletedRecipes,
  persistCompletedRecipes,
} from "./persistence";
import { getKSTDateString } from "../lib/dateUtils";

describe("persistence", () => {
  beforeEach(() => {
    clearCompletedRecipes();
  });

  describe("loadCompletedRecipes", () => {
    it("localStorage가 비어있으면 빈 배열 반환", () => {
      expect(loadCompletedRecipes()).toEqual([]);
    });

    it("오늘 완료한 레시피만 로드", () => {
      addCompletedRecipeRecord("recipe-1");

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(1);
      expect(result[0].recipeId).toBe("recipe-1");
    });

    it("어제 완료한 레시피는 필터링", () => {
      // 어제 날짜로 직접 데이터 저장
      const yesterdayKST = getYesterdayKSTDateString();
      persistCompletedRecipes([
        {
          recipeId: "recipe-old",
          completedAt: Date.now() - 24 * 60 * 60 * 1000,
          completedDateKST: yesterdayKST,
        },
      ]);

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(0);
    });

    it("혼합된 날짜에서 오늘 기록만 반환", () => {
      const todayKST = getKSTDateString();
      const yesterdayKST = getYesterdayKSTDateString();

      persistCompletedRecipes([
        {
          recipeId: "recipe-old",
          completedAt: Date.now() - 24 * 60 * 60 * 1000,
          completedDateKST: yesterdayKST,
        },
        {
          recipeId: "recipe-today",
          completedAt: Date.now(),
          completedDateKST: todayKST,
        },
      ]);

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(1);
      expect(result[0].recipeId).toBe("recipe-today");
    });
  });

  describe("addCompletedRecipeRecord", () => {
    it("새 레시피 완료 기록 추가", () => {
      addCompletedRecipeRecord("recipe-1");

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        recipeId: "recipe-1",
        completedDateKST: getKSTDateString(),
      });
      expect(typeof result[0].completedAt).toBe("number");
    });

    it("같은 레시피 중복 추가 방지", () => {
      addCompletedRecipeRecord("recipe-1");
      addCompletedRecipeRecord("recipe-1");

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(1);
    });

    it("여러 레시피 추가 가능", () => {
      addCompletedRecipeRecord("recipe-1");
      addCompletedRecipeRecord("recipe-2");
      addCompletedRecipeRecord("recipe-3");

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(3);
    });
  });

  describe("clearCompletedRecipes", () => {
    it("모든 완료 기록 삭제", () => {
      addCompletedRecipeRecord("recipe-1");
      addCompletedRecipeRecord("recipe-2");

      clearCompletedRecipes();

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(0);
    });
  });

  describe("날짜 경계 테스트", () => {
    it("날짜가 다르면 초기화됨", () => {
      // 다른 날짜의 데이터를 직접 설정
      const differentDayKST = "2024-01-01";
      persistCompletedRecipes([
        {
          recipeId: "recipe-1",
          completedAt: Date.now(),
          completedDateKST: differentDayKST,
        },
      ]);

      // 오늘 날짜와 다르므로 필터링됨
      const result = loadCompletedRecipes();
      expect(result).toHaveLength(0);
    });

    it("같은 날짜면 유지됨", () => {
      const todayKST = getKSTDateString();
      persistCompletedRecipes([
        {
          recipeId: "recipe-1",
          completedAt: Date.now(),
          completedDateKST: todayKST,
        },
      ]);

      const result = loadCompletedRecipes();
      expect(result).toHaveLength(1);
    });
  });

  describe("SSR 안전성", () => {
    it("정상적인 상황에서 배열 반환", () => {
      const result = loadCompletedRecipes();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

// Helper: 어제 KST 날짜 문자열 생성
function getYesterdayKSTDateString(): string {
  const yesterday = Date.now() - 24 * 60 * 60 * 1000;
  return getKSTDateString(yesterday);
}
