import type { CoupangProduct } from "@/shared/coupang";

// 로켓배송 우선, 같은 그룹 안에서는 가격 오름차순
export const sortCoupangProducts = (
  products: CoupangProduct[]
): CoupangProduct[] =>
  [...products].sort((a, b) => {
    if (a.rocket !== b.rocket) return a.rocket ? -1 : 1;
    return a.price - b.price;
  });
