import { BASE_API_URL } from "@/shared/config/constants/api";

import { resolveApiRouting } from "../apiRouting";

describe("deployment API routing", () => {
  it("T-05: production은 일반 API를 백엔드로 직통하고 proxy하지 않는다", () => {
    expect(resolveApiRouting("production")).toEqual({
      clientBaseURL: BASE_API_URL,
      shouldProxyApiRequests: false,
    });
  });

  it.each(["preview", "development", undefined])(
    "T-06/T-07: %s 환경은 same-origin API와 proxy를 유지한다",
    (vercelEnvironment) => {
      expect(resolveApiRouting(vercelEnvironment)).toEqual({
        clientBaseURL: "/api",
        shouldProxyApiRequests: true,
      });
    }
  );
});
