import * as fs from "fs";
import * as path from "path";

import {
  getAccessToken,
  type InspectOutcome,
  inspectUrl,
  runPool,
  sampleItems,
} from "./lib/gsc";
import { DATA_DIR } from "./lib/seo-constants";

const PROPERTY = "sc-domain:recipio.kr";
const RECIPE_SITEMAP = "https://www.recipio.kr/recipes/sitemap/0.xml";
const COHORT_PATH = path.join(DATA_DIR, "index-experiment.json");
const LOG_PATH = path.join(DATA_DIR, "index-experiment-log.jsonl");
const CONCURRENCY = 4;
const GAP_MS = 120;

const SEARCH_ANALYTICS = (property: string) =>
  `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;

type PageStat = { impressions: number; clicks: number; position: number };

const fetchPageStats = async (
  token: string,
  startDate: string,
  endDate: string
): Promise<Map<string, PageStat>> => {
  const res = await fetch(SEARCH_ANALYTICS(PROPERTY), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 25000,
      dataState: "all",
    }),
  });
  if (!res.ok) throw new Error(`searchAnalytics ${res.status}`);
  const rows = ((await res.json()).rows ?? []) as {
    keys: string[];
    impressions: number;
    clicks: number;
    position: number;
  }[];
  return new Map(
    rows.map((r) => [
      r.keys[0],
      { impressions: r.impressions, clicks: r.clicks, position: r.position },
    ])
  );
};

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

type CohortEntry = { url: string; group: "treated" | "control" };
type Cohort = {
  label: string;
  startedAt: string;
  property: string;
  entries: CohortEntry[];
};

const arg = (name: string, fallback: string) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const fetchSitemapUrls = async (url: string): Promise<string[]> => {
  const xml = await (await fetch(url)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
};

// ── discover: 색인 안 된 레시피 상세 후보 찾기 ──

const discover = async () => {
  const pool = Number(arg("pool", "80"));
  const seed = Number(arg("seed", "20260803"));
  const urls = await fetchSitemapUrls(arg("sitemap", RECIPE_SITEMAP));
  const picked = sampleItems(urls, pool, seed);
  console.log(`sitemap=${urls.length} pool=${picked.length} seed=${seed}`);

  const token = await getAccessToken();
  const results = await runPool(
    picked,
    CONCURRENCY,
    GAP_MS,
    (url) => inspectUrl(token, PROPERTY, url).then((r) => ({ url, ...r })),
    (done, total) => {
      if (done % 20 === 0) console.log(`  ${done}/${total}`);
    }
  );

  const ok = results.filter((r) => !r.error);
  const byState: Record<string, (typeof ok)[number][]> = {};
  for (const r of ok) {
    const key = r.coverageState ?? "(none)";
    (byState[key] ??= []).push(r);
  }

  console.log("\n── 후보 풀 상태 분포 ──");
  for (const [state, rows] of Object.entries(byState).sort(
    (a, b) => b[1].length - a[1].length
  )) {
    console.log(`${rows.length.toString().padStart(4)}  ${state}`);
  }

  const notIndexed = ok.filter((r) => r.verdict !== "PASS");
  const out = path.join(DATA_DIR, "index-experiment-candidates.json");
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    out,
    JSON.stringify({ pool: picked.length, candidates: notIndexed }, null, 2)
  );
  console.log(`\n색인 안 됨 ${notIndexed.length}건 → ${out}`);
};

// ── track: 코호트 상태 스냅샷 적재 ──

const track = async () => {
  if (!fs.existsSync(COHORT_PATH)) {
    throw new Error(`cohort not found: ${COHORT_PATH}`);
  }
  const cohort = JSON.parse(fs.readFileSync(COHORT_PATH, "utf-8")) as Cohort;
  const token = await getAccessToken();

  const windowStart = arg("start", daysAgo(31));
  const windowEnd = arg("end", daysAgo(3));
  const stats = await fetchPageStats(token, windowStart, windowEnd);

  const rows = await runPool(
    cohort.entries,
    CONCURRENCY,
    GAP_MS,
    async (entry) => {
      const r: InspectOutcome = await inspectUrl(token, PROPERTY, entry.url);
      const s = stats.get(entry.url);
      return {
        ...entry,
        ...r,
        impressions: s?.impressions ?? 0,
        clicks: s?.clicks ?? 0,
        position: s?.position ?? null,
      };
    }
  );

  const prev = readPreviousSnapshot();

  const checkedAt = new Date().toISOString();
  const snapshot = {
    checkedAt,
    label: cohort.label,
    window: { startDate: windowStart, endDate: windowEnd },
    rows,
  };
  fs.appendFileSync(LOG_PATH, `${JSON.stringify(snapshot)}\n`);
  console.log(
    `\n── ${cohort.label} · ${checkedAt.slice(0, 16)} · 노출창 ${windowStart}~${windowEnd} ──`
  );
  for (const group of ["treated", "control"] as const) {
    const sub = rows.filter((r) => r.group === group);
    const shown = sub.filter((r) => r.impressions > 0).length;
    const imp = sub.reduce((a, r) => a + r.impressions, 0);
    const clk = sub.reduce((a, r) => a + r.clicks, 0);
    console.log(
      `\n[${group}] 노출된 URL ${shown}/${sub.length} · 총노출 ${imp.toLocaleString()} · 클릭 ${clk.toLocaleString()}`
    );
    for (const r of sub.sort((a, b) => b.impressions - a.impressions)) {
      const before = prev?.rows.find((p) => p.url === r.url);
      const delta =
        before !== undefined
          ? `  (이전 ${before.impressions ?? 0} → ${r.impressions})`
          : "";
      console.log(
        `  ${r.impressions > 0 ? "✓" : "·"} ${(r.url.split("/").pop() ?? "").padEnd(10)}` +
          ` 노출 ${String(r.impressions).padStart(5)} 클릭 ${String(r.clicks).padStart(4)}` +
          ` crawl=${r.lastCrawlTime?.slice(0, 10) ?? "-"}${delta}`
      );
    }
  }
  console.log(`\n→ ${LOG_PATH}`);
};

const readPreviousSnapshot = () => {
  if (!fs.existsSync(LOG_PATH)) return null;
  const lines = fs
    .readFileSync(LOG_PATH, "utf-8")
    .split("\n")
    .filter((l) => l.trim());
  if (lines.length === 0) return null;
  return JSON.parse(lines[lines.length - 1]) as {
    checkedAt: string;
    rows: (CohortEntry & InspectOutcome & { impressions?: number })[];
  };
};

const main = async () => {
  if (process.argv.includes("--discover")) return discover();
  return track();
};

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
