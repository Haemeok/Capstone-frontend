import { config } from "../config.js";

export type FetchResult = {
  status: number;
  body: string;
  ok: boolean;
};

export const fetchWithRetry = async (
  url: string,
  options?: { method?: string; maxRetries?: number }
): Promise<FetchResult> => {
  const { method = "GET", maxRetries = config.request.retries } = options ?? {};
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        config.request.timeoutMs
      );

      const res = await fetch(url, { method, signal: controller.signal });
      clearTimeout(timeout);

      const body = method === "HEAD" ? "" : await res.text();

      return { status: res.status, body, ok: res.ok };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, config.request.retryDelayMs));
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
};

export const fetchPage = async (path: string): Promise<FetchResult> => {
  const url = path.startsWith("http")
    ? path
    : `${config.baseUrl}${path}`;
  return fetchWithRetry(url);
};

export const headRequest = async (url: string): Promise<number> => {
  const result = await fetchWithRetry(url, { method: "HEAD", maxRetries: 1 });
  return result.status;
};
