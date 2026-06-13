import type { RecipeFormDict } from "../../types";

export const recipeForm: RecipeFormDict = {
  labels: {
    title: "レシピのタイトル",
    image: "メイン画像",
    ingredients: "材料",
    cookingTime: "調理時間",
    servings: "人分",
    dishType: "カテゴリー",
    description: "レシピの説明",
    steps: "作り方",
    cookingTools: "調理器具",
    tags: "タグ",
  },
  validation: {
    titleMin: "タイトルは{min}文字以上で入力してください",
    titleMax: "タイトルは{max}文字以内で入力してください",
    imageRequired: "メイン画像を登録してください",
    imageType: "PNG・JPG・WEBP・GIF・AVIF形式の画像をご利用ください",
    imageSize: "{max}MB以下の画像をご利用ください",
    servingsMin: "人分は{min}以上を選択してください",
    cookingTimeMin: "調理時間は{min}以上で入力してください",
    descriptionMin: "説明は{min}文字以上で入力してください",
    quantityRequired: "分量を入力してください",
    unitRequired: "単位を選択してください",
    ingredientsMin: "材料を{min}つ以上追加してください",
    stepsMin: "作り方を{min}ステップ以上追加してください",
    instructionRequired: "手順を入力してください",
    categoryRequired: "カテゴリーを選択してください",
  },
};
