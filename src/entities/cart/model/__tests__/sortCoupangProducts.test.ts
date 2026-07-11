import type { CoupangProduct } from "@/shared/coupang";

import { sortCoupangProducts } from "../sortCoupangProducts";

const product = (overrides: Partial<CoupangProduct>): CoupangProduct => ({
  rank: 1,
  name: "상품",
  price: 10000,
  imageUrl: "https://example.com/p.jpg",
  url: "https://link.coupang.com/p",
  categoryName: "식품",
  rocket: false,
  freeShipping: false,
  ...overrides,
});

it("로켓배송이 먼저, 그 안에서 가격 오름차순으로 정렬한다", () => {
  const sorted = sortCoupangProducts([
    product({ name: "일반-싼거", price: 5000, rocket: false }),
    product({ name: "로켓-비싼거", price: 15000, rocket: true }),
    product({ name: "로켓-싼거", price: 9000, rocket: true }),
    product({ name: "일반-비싼거", price: 20000, rocket: false }),
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
    product({ name: "a", rocket: false }),
    product({ name: "b", rocket: true }),
  ];
  sortCoupangProducts(original);
  expect(original.map((p) => p.name)).toEqual(["a", "b"]);
});
