import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteCartItem = (cartItemId: string): Promise<void> =>
  api.delete<void>(END_POINTS.MY_CART_ITEM(cartItemId));
