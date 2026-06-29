import {
  convertIngredientQuantity,
  formatIngredientAmount,
} from "../ingredientConversion";

describe("convertIngredientQuantity - fraction input", () => {
  it("preserves fraction when ratio is 1", () => {
    expect(convertIngredientQuantity("1/3", "개", 1).quantity).toBe("1/3");
  });

  it("scales fraction by integer ratio", () => {
    expect(convertIngredientQuantity("1/3", "개", 2).quantity).toBe("2/3");
  });

  it("collapses to integer when scaled result has denominator 1", () => {
    expect(convertIngredientQuantity("1/3", "개", 3).quantity).toBe("1");
  });

  it("renders improper fraction as mixed number", () => {
    expect(convertIngredientQuantity("1/3", "개", 5).quantity).toBe("1 2/3");
  });
});

describe("convertIngredientQuantity - decimal input", () => {
  it("scales decimal by integer ratio", () => {
    expect(convertIngredientQuantity("1.5", "개", 2).quantity).toBe("3");
  });

  it("scales integer by fractional ratio", () => {
    expect(convertIngredientQuantity("2", "개", 0.5).quantity).toBe("1");
  });
});

describe("formatIngredientAmount - en abbreviation & spacing", () => {
  it("T-U1: tablespoon(s) -> '3 tbsp'", () => {
    expect(formatIngredientAmount("3", "tablespoon", 1, "en")).toBe("3 tbsp");
    expect(formatIngredientAmount("3", "tablespoons", 1, "en")).toBe("3 tbsp");
  });
  it("T-U2: teaspoon(s) -> 'tsp'", () => {
    expect(formatIngredientAmount("1", "teaspoon", 1, "en")).toBe("1 tsp");
    expect(formatIngredientAmount("2", "teaspoons", 1, "en")).toBe("2 tsp");
  });
});

describe("formatIngredientAmount - ko/ja unchanged", () => {
  it("T-U4: ko -> '1개'", () => {
    expect(formatIngredientAmount("1", "개", 1, "ko")).toBe("1개");
  });
  it("T-U5: ja -> '1大さじ'", () => {
    expect(formatIngredientAmount("1", "大さじ", 1, "ja")).toBe("1大さじ");
  });
});

describe("formatIngredientAmount - en countable singular/plural", () => {
  it("T-U6: 수량 1 -> 단수 (들어온 형태 무관)", () => {
    expect(formatIngredientAmount("1", "piece", 1, "en")).toBe("1 piece");
    expect(formatIngredientAmount("1", "pieces", 1, "en")).toBe("1 piece");
  });
  it("T-U7: 수량 ≠ 1 -> 복수", () => {
    expect(formatIngredientAmount("2", "piece", 1, "en")).toBe("2 pieces");
    expect(formatIngredientAmount("0.5", "cup", 1, "en")).toBe("0.5 cups");
  });
  it("T-U13: 스케일 후 수량으로 단복수 결정", () => {
    expect(formatIngredientAmount("2", "piece", 0.5, "en")).toBe("1 piece");
    expect(formatIngredientAmount("1", "piece", 2, "en")).toBe("2 pieces");
  });
  it("T-U14: sheets는 leaves가 아니라 sheets 유지", () => {
    expect(formatIngredientAmount("10", "sheets", 1, "en")).toBe("10 sheets");
    expect(formatIngredientAmount("1", "sheets", 1, "en")).toBe("1 sheet");
  });
});

describe("formatIngredientAmount - en passthrough / decimal / unitless", () => {
  it("T-U9: mass/volume는 공백만, 복수화 없음", () => {
    expect(formatIngredientAmount("200", "g", 1, "en")).toBe("200 g");
    expect(formatIngredientAmount("27", "ml", 1, "en")).toBe("27 ml");
  });
  it("T-U10: 미등록 단위는 원본 통과 + 공백", () => {
    expect(formatIngredientAmount("3", "dollop", 1, "en")).toBe("3 dollop");
  });
  it("T-U11: 소수는 분수로 안 바뀜", () => {
    expect(formatIngredientAmount("0.5", "tablespoon", 1, "en")).toBe(
      "0.5 tbsp"
    );
  });
  it("T-U12: 무단위 수량은 단위·끝공백 없음", () => {
    expect(formatIngredientAmount("약간", "개", 1, "en")).toBe("약간");
    expect(formatIngredientAmount("", "g", 1, "en")).toBe("");
  });
});
