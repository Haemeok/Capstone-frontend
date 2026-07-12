import type { CoupangDeliveryType } from "../model/types";

// 로켓계열 = 로켓프레시 + 일반 로켓배송
export const isRocketDelivery = (deliveryType: CoupangDeliveryType): boolean =>
  deliveryType !== "STANDARD";
