import * as fs from "fs";
import * as path from "path";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const INSPECT_API =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const SITES_API = "https://searchconsole.googleapis.com/webmasters/v3/sites";

export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

type ServiceAccount = { client_email: string; private_key: string };
type AuthorizedUser = {
  client_id: string;
  client_secret: string;
  refresh_token: string;
};

const createJwt = async (sa: ServiceAccount): Promise<string> => {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: GSC_SCOPE,
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

export const getAccessToken = async (): Promise<string> => {
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
      return postToken({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: await createJwt(cred as unknown as ServiceAccount),
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
    "No credentials. Set GOOGLE_SERVICE_ACCOUNT_KEY_PATH to a service account JSON key."
  );
};

export const listSites = async (token: string): Promise<string> => {
  const res = await fetch(SITES_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return `${res.status} ${await res.text()}`;
};

export type IndexStatus = {
  verdict?: string;
  coverageState?: string;
  indexingState?: string;
  robotsTxtState?: string;
  pageFetchState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  crawledAs?: string;
  referringUrls?: string[];
  sitemaps?: string[];
};

export type InspectOutcome = IndexStatus & { status: number; error?: string };

export const inspectUrl = async (
  token: string,
  property: string,
  url: string
): Promise<InspectOutcome> => {
  const res = await fetch(INSPECT_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl: url,
      siteUrl: property,
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
    crawledAs: idx.crawledAs,
    referringUrls: idx.referringUrls,
    sitemaps: idx.sitemap,
  };
};

export const runPool = async <T, R>(
  items: T[],
  concurrency: number,
  gapMs: number,
  task: (item: T, index: number) => Promise<R>,
  onProgress?: (done: number, total: number) => void
): Promise<R[]> => {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  let done = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await task(items[i], i);
      done += 1;
      onProgress?.(done, items.length);
      if (gapMs > 0) await new Promise((r) => setTimeout(r, gapMs));
    }
  };

  await Promise.all(Array.from({ length: concurrency }, worker));
  return out;
};

export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const sampleItems = <T>(items: T[], n: number, seed: number): T[] => {
  const rand = mulberry32(seed);
  const idx = items.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(n, items.length)).map((i) => items[i]);
};
