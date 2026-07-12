import type { CoupangProduct } from "@/shared/coupang";

import { sortCoupangProducts } from "../sortCoupangProducts";

const product = (overrides: Partial<CoupangProduct>): CoupangProduct => ({
  rank: 1,
  name: "상품",
  price: 10000,
  imageUrl: "https://example.com/p.jpg",
  url: "https://link.coupang.com/p",
  deliveryType: "STANDARD",
  freeShipping: false,
  ...overrides,
});

it("로켓배송이 먼저, 그 안에서 가격 오름차순으로 정렬한다", () => {
  const sorted = sortCoupangProducts([
    product({ name: "일반-싼거", price: 5000, deliveryType: "STANDARD" }),
    product({ name: "로켓-비싼거", price: 15000, deliveryType: "ROCKET" }),
    product({ name: "로켓-싼거", price: 9000, deliveryType: "ROCKET" }),
    product({ name: "일반-비싼거", price: 20000, deliveryType: "STANDARD" }),
  ]);

  expect(sorted.map((p) => p.name)).toEqual([
    "로켓-싼거",
    "로켓-비싼거",
    "일반-싼거",
    "일반-비싼거",
  ]);
});

it("원본 배열을 변경하지 않는다", () => {
  const original = [
    product({ name: "a", deliveryType: "STANDARD" }),
    product({ name: "b", deliveryType: "ROCKET" }),
  ];
  sortCoupangProducts(original);
  expect(original.map((p) => p.name)).toEqual(["a", "b"]);
});
