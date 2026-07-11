import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { UpdateCartItemRequest } from "./types";

export const updateCartItem = (
  cartItemId: string,
  body: UpdateCartItemRequest
): Promise<void> => api.patch<void>(END_POINTS.MY_CART_ITEM(cartItemId), body);
