import type { CookingUnitsDict } from "../../types";

export const cookingUnits: CookingUnitsDict = {
  tableTrigger: "Cooking unit conversions",
  tableTitle: "Cooking unit conversions",
  tableDescription: "Check the measurements that come up most in recipes.",
  conversions: [
    { unit: "1 tbsp (1T)", value: "15ml", tip: "about 2 rice spoons" },
    { unit: "1 tsp (1t)", value: "5ml", tip: "1 teaspoon" },
    { unit: "1 cup (1C)", value: "200ml", tip: "a full paper cup is ~180ml" },
  ],
};
