import * as fs from "fs";
import * as path from "path";

import {
  getAccessToken,
  type IndexStatus,
  inspectUrl,
  listSites,
  sampleItems,
} from "./lib/gsc";
import { DATA_DIR, today } from "./lib/seo-constants";

const SITE_URL = "https://www.recipio.kr";
const ALLOWLIST_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/seo/allowlist.json";
const CONCURRENCY = 4;
const REQUEST_GAP_MS = 120;

type AllowlistPage = Record<string, string | number>;

type Args = {
  limit: number;
  seed: number;
  origin: string;
  property: string;
  allowlist: string;
  out: string;
};

const parseArgs = (): Args => {
  const get = (name: string, fallback: string) => {
    const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : fallback;
  };
  const origin = get("origin", SITE_URL);
  return {
    limit: Number(get("limit", "500")),
    seed: Number(get("seed", "20260803")),
    origin,
    property: get("property", origin),
    allowlist: get("allowlist", ALLOWLIST_URL),
    out: get("out", path.join(DATA_DIR, `gsc-index-check-${today()}.json`)),
  };
};

// ── URL 인벤토리 ──

const loadAllowlist = async (source: string): Promise<AllowlistPage[]> => {
  const raw = source.startsWith("http")
    ? await (await fetch(source)).text()
    : fs.readFileSync(source, "utf-8");
  const data = JSON.parse(raw) as { pages?: AllowlistPage[] };
  return data.pages ?? [];
};

const buildUrl = (origin: string, params: AllowlistPage): string => {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  return `${origin}/search/results?${qs}`;
};

const shapeOf = (params: AllowlistPage): string =>
  Object.keys(params).sort().join(",");

const stratumOf = (params: AllowlistPage): string => {
  const keys = Object.keys(params);
  return keys.length === 1 && keys[0] === "q" ? "q-only" : "filter-combo";
};

type InspectResult = IndexStatus & {
  url: string;
  stratum: string;
  shape: string;
  error?: string;
};

// ── 통계 ──

const wilson = (successes: number, n: number) => {
  if (n === 0) return { p: 0, low: 0, high: 0 };
  const z = 1.96;
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = p + (z * z) / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return {
    p,
    low: clamp((center - margin) / denom),
    high: clamp((center + margin) / denom),
  };
};

const isIndexed = (r: InspectResult): boolean => r.verdict === "PASS";

// ── main ──

const main = async () => {
  const args = parseArgs();

  if (process.argv.includes("--list-sites")) {
    console.log(await listSites(await getAccessToken()));
    return;
  }

  const pages = await loadAllowlist(args.allowlist);
  if (pages.length === 0) throw new Error("allowlist is empty");

  const inventory = pages.map((p) => ({
    url: buildUrl(args.origin, p),
    stratum: stratumOf(p),
    shape: shapeOf(p),
  }));

  const picked = sampleItems(inventory, args.limit, args.seed);
  console.log(
    `inventory=${inventory.length} sample=${picked.length} seed=${args.seed}`
  );

  const token = await getAccessToken();

  const results: InspectResult[] = [];
  let quotaHit = false;
  let cursor = 0;

  const worker = async () => {
    while (cursor < picked.length && !quotaHit) {
      const item = picked[cursor++];
      const n = cursor;
      try {
        const { status, ...rest } = await inspectUrl(
          token,
          args.property,
          item.url
        );
        if (status === 429) {
          quotaHit = true;
          console.error(`quota exhausted at ${n}: ${rest.error}`);
          break;
        }
        results.push({ ...item, ...rest });
      } catch (e) {
        results.push({ ...item, error: String(e) });
      }
      if (n % 25 === 0) console.log(`  ${n}/${picked.length}`);
      await new Promise((res) => setTimeout(res, REQUEST_GAP_MS));
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const ok = results.filter((r) => !r.error);
  const indexed = ok.filter(isIndexed);
  const overall = wilson(indexed.length, ok.length);

  const byStratum: Record<string, unknown> = {};
  for (const s of ["q-only", "filter-combo"]) {
    const sub = ok.filter((r) => r.stratum === s);
    const hit = sub.filter(isIndexed);
    const pop = inventory.filter((i) => i.stratum === s).length;
    const w = wilson(hit.length, sub.length);
    byStratum[s] = {
      population: pop,
      sampled: sub.length,
      indexed: hit.length,
      rate: w.p,
      ci95: [w.low, w.high],
      estimatedIndexed: Math.round(w.p * pop),
      estimateRange: [Math.round(w.low * pop), Math.round(w.high * pop)],
    };
  }

  const coverageBreakdown: Record<string, number> = {};
  for (const r of ok) {
    const key = r.coverageState ?? "(none)";
    coverageBreakdown[key] = (coverageBreakdown[key] ?? 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    origin: args.origin,
    property: args.property,
    allowlistSource: args.allowlist,
    inventory: inventory.length,
    sampled: picked.length,
    inspected: ok.length,
    failed: results.length - ok.length,
    quotaHit,
    indexed: indexed.length,
    indexedRate: overall.p,
    ci95: [overall.low, overall.high],
    estimatedIndexedTotal: Math.round(overall.p * inventory.length),
    estimateRange: [
      Math.round(overall.low * inventory.length),
      Math.round(overall.high * inventory.length),
    ],
    coverageBreakdown,
    byStratum,
    results,
  };

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(report, null, 2));

  console.log("\n── 색인 잔존 추정 ──");
  console.log(`표본 ${ok.length}건 중 색인 ${indexed.length}건`);
  console.log(
    `비율 ${(overall.p * 100).toFixed(1)}% (95% CI ${(overall.low * 100).toFixed(1)}~${(overall.high * 100).toFixed(1)}%)`
  );
  console.log(
    `전체 ${inventory.length}개 기준 추정 잔존 ${report.estimatedIndexedTotal}개 (${report.estimateRange[0]}~${report.estimateRange[1]})`
  );
  console.log("coverageState 분포:", coverageBreakdown);
  console.log(`\n→ ${args.out}`);
};

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
