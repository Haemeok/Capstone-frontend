import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CartResponse } from "./types";

export const getCart = (): Promise<CartResponse> =>
  api.get<CartResponse>(END_POINTS.MY_CART);
