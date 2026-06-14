import type { CookingUnitsDict } from "../../types";

export const cookingUnits: CookingUnitsDict = {
  tableTrigger: "요리 단위 변환표",
  tableTitle: "요리 단위 변환표",
  tableDescription: "레시피에 자주 나오는 계량 단위를 확인해보세요",
  conversions: [
    { unit: "1큰술 (1T)", value: "15ml", tip: "밥숟가락 약 2번" },
    { unit: "1작은술 (1t)", value: "5ml", tip: "티스푼 1개" },
    { unit: "1컵 (1C)", value: "200ml", tip: "종이컵 가득은 약 180ml" },
  ],
};
