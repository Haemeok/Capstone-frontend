import type { CookingUnitsDict } from "../../types";

export const cookingUnits: CookingUnitsDict = {
  tableTrigger: "計量単位の換算表",
  tableTitle: "計量単位の換算表",
  tableDescription: "レシピでよく使う計量単位を確認しましょう",
  conversions: [
    { unit: "大さじ1 (1T)", value: "15ml", tip: "ご飯スプーン約2杯" },
    { unit: "小さじ1 (1t)", value: "5ml", tip: "ティースプーン1杯" },
    { unit: "1カップ (1C)", value: "200ml", tip: "紙コップ山盛りで約180ml" },
  ],
};
