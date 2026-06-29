import { toRecipe } from "../api";
import type { RawRecipeResponse } from "../types";

const base = {
  id: "r1",
  title: "김치찌개",
  dishType: "stew",
  description: "",
  cookingTime: 30,
  imageUrl: "",
  cookingTools: [],
  servings: 2,
  totalIngredientCost: 0,
  marketPrice: 0,
  ratingInfo: { avgRating: 0, myRating: 0, ratingCount: 0 },
  ingredients: [],
  steps: [],
  tags: [],
  comments: [],
  author: { id: "a1", nickname: "민지", profileImage: "" },
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
  totalCalories: 0,
  nutrition: { protein: 0, carbohydrate: 0, fat: 0, sugar: 0, sodium: 0 },
  isCloneable: true,
} as unknown as RawRecipeResponse;

describe("toRecipe", () => {
  it("source가 없으면 USER 기본값을 채운다", () => {
    expect(toRecipe({ ...base, source: undefined }).source).toBe("USER");
  });
  it("source가 오면 보존한다", () => {
    expect(toRecipe({ ...base, source: "YOUTUBE" }).source).toBe("YOUTUBE");
  });
  it("youtube 필드가 있으면 nested youtube 블록으로 조립한다", () => {
    const r = toRecipe({
      ...base,
      source: "YOUTUBE",
      youtubeUrl: "https://youtu.be/x",
      youtubeChannelName: "백종원",
    });
    expect(r.youtube?.url).toBe("https://youtu.be/x");
    expect(r.youtube?.channelName).toBe("백종원");
  });
  it("youtube 필드가 없으면 youtube는 undefined다", () => {
    expect(toRecipe({ ...base, source: "USER" }).youtube).toBeUndefined();
  });
});
