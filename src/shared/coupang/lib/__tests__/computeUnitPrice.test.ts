import { computeUnitPrice } from "../computeUnitPrice";

describe("computeUnitPrice", () => {
  it.each([
    ["한돈 앞다리살 전지 1kg", 12900, { base: "100g", unitPrice: 1290 }],
    ["곰곰 소금 50g", 2000, { base: "10g", unitPrice: 400 }],
    ["서울우유 900ml", 2800, { base: "100ml", unitPrice: 311 }],
    ["바닐라 에센스 30ml", 5000, { base: "10ml", unitPrice: 1667 }],
    ["계란 30구", 7500, { base: "1개", unitPrice: 250 }],
    ["김 5봉", 5000, { base: "1개", unitPrice: 1000 }],
    ["다시마 1m", 3000, { base: "1m", unitPrice: 3000 }],
    ["리본 50cm", 1000, { base: "10cm", unitPrice: 200 }],
    ["노브랜드 생수 2L x 6", 3600, { base: "100ml", unitPrice: 30 }],
    ["우유 1L 2입", 4000, { base: "100ml", unitPrice: 200 }],
  ])("%s → 단위가격", (name, price, expected) => {
    expect(computeUnitPrice(name as string, price as number)).toEqual(expected);
  });

  it.each([
    ["국내산 대파", 2000],
    ["돼지고기 전지", 12900],
  ])("수량 토큰 없으면 null (%s)", (name, price) => {
    expect(computeUnitPrice(name as string, price as number)).toBeNull();
  });
});
