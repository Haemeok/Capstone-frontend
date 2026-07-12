import type { CoupangProduct } from "@/shared/coupang";
import { isRocketDelivery } from "@/shared/coupang/lib/isRocketDelivery";

// 로켓계열(프레시+일반로켓) 우선, 같은 묶음 안에서는 가격 오름차순
export const sortCoupangProducts = (
  products: CoupangProduct[]
): CoupangProduct[] =>
  [...products].sort((a, b) => {
    const aRocket = isRocketDelivery(a.deliveryType);
    const bRocket = isRocketDelivery(b.deliveryType);
    if (aRocket !== bRocket) return aRocket ? -1 : 1;
    return a.price - b.price;
  });
