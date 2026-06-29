type SafeFetchOptions<T> = {
  revalidate: number | false;
  tags: string[];
  fallback: T;
  timeoutMs?: number;
};

export type WithFetchStatus<T> = T & { fetchFailed: boolean };

const DEFAULT_TIMEOUT_MS = 8000;

export const safeFetchJson = async <T extends object>(
  url: string,
  {
    revalidate,
    tags,
    fallback,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: SafeFetchOptions<T>
): Promise<WithFetchStatus<T>> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate, tags },
    });
    if (!res.ok) return { ...fallback, fetchFailed: true };
    return { ...((await res.json()) as T), fetchFailed: false };
  } catch {
    return { ...fallback, fetchFailed: true };
  } finally {
    clearTimeout(timer);
  }
};
