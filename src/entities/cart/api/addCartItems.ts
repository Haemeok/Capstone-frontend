import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { AddCartItemsRequest, AddCartItemsResponse } from "./types";

export const addCartItems = (
  body: AddCartItemsRequest
): Promise<AddCartItemsResponse> =>
  api.post<AddCartItemsResponse>(END_POINTS.MY_CART_ITEMS, body);
