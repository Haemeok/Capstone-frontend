import * as fs from "fs";
import * as path from "path";

import { DATA_DIR, today } from "./lib/seo-constants";

const SITE_URL = "https://www.recipio.kr";
const ALLOWLIST_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/seo/allowlist.json";
const INSPECT_API =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
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

// ── Google Auth: 서비스 계정 JWT 또는 gcloud ADC(authorized_user) ──

type ServiceAccount = { client_email: string; private_key: string };
type AuthorizedUser = {
  client_id: string;
  client_secret: string;
  refresh_token: string;
};

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

const createJwt = async (sa: ServiceAccount): Promise<string> => {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  return `${header}.${payload}.${sign.sign(sa.private_key, "base64url")}`;
};

const postToken = async (body: Record<string, string>): Promise<string> => {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  if (!res.ok)
    throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
};

const adcPath = (): string | null => {
  const explicit = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (explicit && fs.existsSync(explicit)) return explicit;
  const appData = process.env.APPDATA;
  const home = process.env.HOME || process.env.USERPROFILE || "";
  const candidates = [
    appData &&
      path.join(appData, "gcloud", "application_default_credentials.json"),
    path.join(
      home,
      ".config",
      "gcloud",
      "application_default_credentials.json"
    ),
  ].filter(Boolean) as string[];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
};

const getAccessToken = async (): Promise<string> => {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (keyPath && fs.existsSync(keyPath)) {
    const sa = JSON.parse(fs.readFileSync(keyPath, "utf-8")) as ServiceAccount;
    return postToken({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: await createJwt(sa),
    });
  }

  const adc = adcPath();
  if (adc) {
    const cred = JSON.parse(fs.readFileSync(adc, "utf-8")) as AuthorizedUser & {
      type?: string;
    };
    if (cred.type === "service_account") {
      const sa = cred as unknown as ServiceAccount;
      return postToken({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: await createJwt(sa),
      });
    }
    return postToken({
      grant_type: "refresh_token",
      client_id: cred.client_id,
      client_secret: cred.client_secret,
      refresh_token: cred.refresh_token,
    });
  }

  throw new Error(
    "No credentials. Set GOOGLE_SERVICE_ACCOUNT_KEY_PATH, or run:\n" +
      `  gcloud auth application-default login --scopes=openid,${SCOPE}`
  );
};

// ── URL 인벤토리 ──

const loadAllowlist = async (source: string): Promise<AllowlistPage[]> => {
  const raw = source.startsWith("http")
    ? await (await fetch(source)).text()
    : fs.readFileSync(source, "utf-8");
  const data = JSON.parse(raw) as { pages?: AllowlistPage[] };
  return data.pages ?? [];
};

const buildUrl = (site: string, params: AllowlistPage): string => {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  return `${site}/search/results?${qs}`;
};

const shapeOf = (params: AllowlistPage): string =>
  Object.keys(params).sort().join(",");

const stratumOf = (params: AllowlistPage): string => {
  const keys = Object.keys(params);
  if (keys.length === 1 && keys[0] === "q") return "q-only";
  return "filter-combo";
};

// ── 시드 고정 랜덤 표집 ──

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const sample = <T>(items: T[], n: number, seed: number): T[] => {
  const rand = mulberry32(seed);
  const idx = items.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(n, items.length)).map((i) => items[i]);
};

// ── Inspection API ──

type InspectResult = {
  url: string;
  stratum: string;
  shape: string;
  verdict?: string;
  coverageState?: string;
  indexingState?: string;
  robotsTxtState?: string;
  pageFetchState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  error?: string;
};

const inspect = async (
  token: string,
  site: string,
  url: string
): Promise<Partial<InspectResult> & { status: number }> => {
  const res = await fetch(INSPECT_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl: url,
      siteUrl: site,
      languageCode: "ko",
    }),
  });

  if (!res.ok) {
    return { status: res.status, error: (await res.text()).slice(0, 300) };
  }

  const data = await res.json();
  const idx = data?.inspectionResult?.indexStatusResult ?? {};
  return {
    status: 200,
    verdict: idx.verdict,
    coverageState: idx.coverageState,
    indexingState: idx.indexingState,
    robotsTxtState: idx.robotsTxtState,
    pageFetchState: idx.pageFetchState,
    lastCrawlTime: idx.lastCrawlTime,
    googleCanonical: idx.googleCanonicalUrl,
    userCanonical: idx.userCanonicalUrl,
  };
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

const listSites = async (token: string) => {
  const res = await fetch(
    "https://searchconsole.googleapis.com/webmasters/v3/sites",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log(res.status, await res.text());
};

const main = async () => {
  const args = parseArgs();

  if (process.argv.includes("--list-sites")) {
    await listSites(await getAccessToken());
    return;
  }

  const pages = await loadAllowlist(args.allowlist);
  if (pages.length === 0) throw new Error("allowlist is empty");

  const inventory = pages.map((p) => ({
    url: buildUrl(args.origin, p),
    stratum: stratumOf(p),
    shape: shapeOf(p),
  }));

  const picked = sample(inventory, args.limit, args.seed);
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
        const r = await inspect(token, args.property, item.url);
        if (r.status === 429) {
          quotaHit = true;
          console.error(`quota exhausted at ${n}: ${r.error}`);
          break;
        }
        results.push({ ...item, ...r, status: undefined } as InspectResult);
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
