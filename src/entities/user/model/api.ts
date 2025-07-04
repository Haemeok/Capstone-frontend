import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

import { User } from "./types";

export const getUserInfo = async (userId: number) => {
  if (typeof userId !== "number") {
    throw new Error("userId is not a number");
  }
  const { data } = await axiosInstance.get<User>(END_POINTS.USER_INFO(userId));

  return data;
};
