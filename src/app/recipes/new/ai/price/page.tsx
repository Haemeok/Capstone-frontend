import { Metadata } from "next";
import BudgetRecipe from "@/widgets/BudgetRecipe";

export const metadata: Metadata = {
  title: "가성비 레시피 추천 | Recipio",
  description:
    "예산에 맞는 가성비 레시피를 AI가 추천해드립니다. 직장인 평균 한끼보다 저렴하게 맛있는 요리를 즐겨보세요.",
};

const BudgetRecipePage = () => {
  return <BudgetRecipe />;
};

export default BudgetRecipePage;
