import { ApiError } from "@/shared/api/errors";

import { shouldRetryQuery } from "../queryClient";

it("401 응답은 재시도하지 않는다 (T-19)", () => {
  expect(shouldRetryQuery(0, new ApiError(401, "Unauthorized"))).toBe(false);
});

it("401이 아닌 오류는 1회만 재시도한다 (T-20)", () => {
  expect(shouldRetryQuery(0, new ApiError(500, "Server Error"))).toBe(true);
  expect(shouldRetryQuery(1, new ApiError(500, "Server Error"))).toBe(false);
  expect(shouldRetryQuery(0, new ApiError(0, "Network Error"))).toBe(true);
});
