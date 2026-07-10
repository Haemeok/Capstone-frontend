import { bloomHas, buildBloom } from "..";

const makeIds = (prefix: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `${prefix}${i.toString(36)}`);

describe("bloom", () => {
  it("never returns a false negative for inserted keys", () => {
    const ids = makeIds("indexed-", 5000);
    const bloom = buildBloom(ids, { fp: 0.001, version: 1 });
    for (const id of ids) {
      expect(bloomHas(bloom, id)).toBe(true);
    }
  });

  it("keeps the false-positive rate near the target for the 1만 scale", () => {
    const indexed = makeIds("indexed-", 10000);
    const bloom = buildBloom(indexed, { fp: 0.001, version: 1 });

    const others = makeIds("other-", 20000);
    const falsePositives = others.filter((id) => bloomHas(bloom, id)).length;

    expect(falsePositives / others.length).toBeLessThan(0.01);
  });

  it("fits well within the Edge Config Pro 64KB budget at the 1만 scale", () => {
    const bloom = buildBloom(makeIds("indexed-", 10000), {
      fp: 0.001,
      version: 1,
    });
    const jsonBytes = Buffer.byteLength(JSON.stringify(bloom), "utf8");
    expect(jsonBytes).toBeLessThan(64 * 1024);
  });

  it("round-trips through JSON serialization", () => {
    const ids = makeIds("indexed-", 100);
    const bloom = buildBloom(ids, { fp: 0.001, version: 42 });
    const restored = JSON.parse(JSON.stringify(bloom));
    expect(restored.v).toBe(42);
    for (const id of ids) {
      expect(bloomHas(restored, id)).toBe(true);
    }
  });
});
