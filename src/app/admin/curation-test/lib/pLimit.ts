export type PMapResult<T> = { ok: true; value: T } | { ok: false; error: unknown };

export const pMap = async <In, Out>(
  items: readonly In[],
  concurrency: number,
  worker: (item: In, index: number) => Promise<Out>,
): Promise<PMapResult<Out>[]> => {
  const limit = Math.max(1, concurrency);
  const results: PMapResult<Out>[] = new Array(items.length);
  let nextIndex = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      try {
        const value = await worker(items[i], i);
        results[i] = { ok: true, value };
      } catch (error) {
        results[i] = { ok: false, error };
      }
    }
  });

  await Promise.all(runners);
  return results;
};
