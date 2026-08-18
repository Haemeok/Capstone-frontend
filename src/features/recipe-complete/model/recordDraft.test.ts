import { toRecipeCookingRecordInput } from "./recordDraft";

describe("toRecipeCookingRecordInput", () => {
  it("공개 후기는 기록 메모와 레시피 후기에 같은 내용을 보냅니다", () => {
    expect(
      toRecipeCookingRecordInput({
        recipeId: "recipe-A",
        review: "  다음에는 덜 맵게 만들기  ",
        isPublic: true,
      })
    ).toEqual({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      recordMemo: "다음에는 덜 맵게 만들기",
      reviewContent: "다음에는 덜 맵게 만들기",
      publishReview: true,
    });
  });

  it("비공개 후기는 기록 메모만 보내고 레시피 후기는 만들지 않습니다", () => {
    expect(
      toRecipeCookingRecordInput({
        recipeId: "recipe-A",
        review: "나만 보는 메모",
        isPublic: false,
      })
    ).toEqual({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      recordMemo: "나만 보는 메모",
      publishReview: false,
    });
  });

  it("빈 후기는 선택 필드를 생략합니다", () => {
    expect(
      toRecipeCookingRecordInput({
        recipeId: "recipe-A",
        review: "   ",
        isPublic: true,
      })
    ).toEqual({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      publishReview: true,
    });
  });
});
