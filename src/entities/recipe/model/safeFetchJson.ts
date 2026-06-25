type SafeFetchOptions<T> = {
  revalidate: number | false;
  tags: string[];
  fallback: T;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 8000;

export const safeFetchJson = async <T>(
  url: string,
  {
    revalidate,
    tags,
    fallback,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: SafeFetchOptions<T>
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate, tags },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
};
