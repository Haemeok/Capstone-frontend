import { convertIngredientQuantity } from "../ingredientConversion";

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
