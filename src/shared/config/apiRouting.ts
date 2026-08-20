import { BASE_API_URL } from "./constants/api";

export const SAME_ORIGIN_API_BASE_URL = "/api";

export const resolveClientApiBaseURL = (
  requestPath: string,
  configuredBaseURL: string
) =>
  requestPath.startsWith("/bff/")
    ? SAME_ORIGIN_API_BASE_URL
    : configuredBaseURL;

export const resolveApiRouting = (vercelEnvironment?: string) => {
  const isProductionDeployment = vercelEnvironment === "production";

  return {
    clientBaseURL: isProductionDeployment
      ? BASE_API_URL
      : SAME_ORIGIN_API_BASE_URL,
    shouldProxyApiRequests: !isProductionDeployment,
  } as const;
};
