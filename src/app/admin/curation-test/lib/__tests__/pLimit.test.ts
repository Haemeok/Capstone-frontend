import { pMap } from "../pLimit";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe("pMap (concurrency-limited Promise.all)", () => {
  it("모든 항목을 처리하고 입력 순서로 결과 반환", async () => {
    const items = [1, 2, 3, 4];
    const results = await pMap(items, 2, async (n) => n * 10);
    expect(results).toEqual([
      { ok: true, value: 10 },
      { ok: true, value: 20 },
      { ok: true, value: 30 },
      { ok: true, value: 40 },
    ]);
  });

  it("동시 실행 갯수가 concurrency를 넘지 않는다", async () => {
    let active = 0;
    let peak = 0;
    const items = [1, 2, 3, 4, 5, 6];
    await pMap(items, 2, async () => {
      active++;
      peak = Math.max(peak, active);
      await sleep(20);
      active--;
    });
    expect(peak).toBeLessThanOrEqual(2);
  });

  it("개별 항목 실패는 ok:false로 캡처, 다른 항목은 계속 진행", async () => {
    const items = [1, 2, 3];
    const results = await pMap(items, 2, async (n) => {
      if (n === 2) throw new Error("boom");
      return n * 10;
    });
    expect(results[0]).toEqual({ ok: true, value: 10 });
    expect(results[1].ok).toBe(false);
    if (!results[1].ok) {
      expect((results[1].error as Error).message).toBe("boom");
    }
    expect(results[2]).toEqual({ ok: true, value: 30 });
  });

  it("빈 배열이면 빈 결과", async () => {
    const results = await pMap<number, number>([], 3, async (n) => n);
    expect(results).toEqual([]);
  });

  it("concurrency 1이면 순차 실행", async () => {
    const order: number[] = [];
    await pMap([1, 2, 3], 1, async (n) => {
      order.push(n);
      await sleep(10);
    });
    expect(order).toEqual([1, 2, 3]);
  });

  it("concurrency가 항목 수보다 크면 모두 동시에", async () => {
    let peak = 0;
    let active = 0;
    await pMap([1, 2, 3], 10, async () => {
      active++;
      peak = Math.max(peak, active);
      await sleep(10);
      active--;
    });
    expect(peak).toBe(3);
  });
});
