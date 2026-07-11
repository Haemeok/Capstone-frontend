import type { CartItem } from "../../api/types";
import { groupCartItemsByName } from "../groupCartItemsByName";

const item = (overrides: Partial<CartItem>): CartItem => ({
  cartItemId: "c8Ab7XyZ",
  name: "신김치",
  quantity: "200",
  unit: "g",
  recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", deleted: false },
  ...overrides,
});

it("이름이 다른 항목은 각자 그룹이 되고 총량이 없다", () => {
  const groups = groupCartItemsByName([
    item({ cartItemId: "c1", name: "신김치" }),
    item({ cartItemId: "c2", name: "대파" }),
  ]);

  expect(groups.map((g) => g.name)).toEqual(["신김치", "대파"]);
  expect(groups.map((g) => g.totalAmount)).toEqual([null, null]);
});

it("같은 이름 + 숫자 수량 + 동일 단위면 총량을 합산한다", () => {
  const groups = groupCartItemsByName([
    item({ cartItemId: "c1", quantity: "200" }),
    item({
      cartItemId: "c2",
      quantity: "100",
      recipe: { recipeId: "z2Cd5TeF", title: "김치전", deleted: false },
    }),
  ]);

  expect(groups).toHaveLength(1);
  expect(groups[0].items).toHaveLength(2);
  expect(groups[0].totalAmount).toBe("300g");
});

it("수량이 자유 텍스트면 합산하지 않는다", () => {
  const groups = groupCartItemsByName([
    item({ cartItemId: "c1", quantity: "약간" }),
    item({ cartItemId: "c2", quantity: "100" }),
  ]);

  expect(groups[0].totalAmount).toBeNull();
});

it("단위가 서로 다르면 합산하지 않는다", () => {
  const groups = groupCartItemsByName([
    item({ cartItemId: "c1", unit: "g" }),
    item({ cartItemId: "c2", unit: "큰술" }),
  ]);

  expect(groups[0].totalAmount).toBeNull();
});

it("소수 합산은 부동소수점 잔재 없이 표기한다", () => {
  const groups = groupCartItemsByName([
    item({ cartItemId: "c1", quantity: "0.1" }),
    item({ cartItemId: "c2", quantity: "0.2" }),
  ]);

  expect(groups[0].totalAmount).toBe("0.3g");
});
