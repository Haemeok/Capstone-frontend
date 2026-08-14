import { randomUUID } from "crypto";
import path from "path";
import { z } from "zod";

import { getAccessToken, inspectUrl, listSites } from "./lib/gsc";
import {
  type AuditDependencies,
  runAuditCommand,
  type SitemapIndex,
} from "./lib/gsc-index-audit";
import { appendEvent } from "./lib/gsc-index-audit-store";

const DATA_DIR = path.resolve(process.cwd(), "docs", "gsc-index-status");
const SITEMAP_BASE = "https://www.recipio.kr/recipes/sitemap/";

const SiteListSchema = z.object({
  siteEntry: z.array(z.object({ siteUrl: z.string() })).optional(),
});

const fetchSitemapXml = async (index: SitemapIndex): Promise<string> => {
  const response = await fetch(new URL(`${index}.xml`, SITEMAP_BASE));
  if (!response.ok) {
    throw new Error(`Sitemap request failed: ${response.status}`);
  }
  return response.text();
};

const parseSitesResponse = (
  response: string
): { status: number; body: string } => {
  const separatorIndex = response.indexOf(" ");
  if (separatorIndex < 1) throw new Error("Invalid GSC sites response");
  const status = Number(response.slice(0, separatorIndex));
  if (!Number.isInteger(status)) throw new Error("Invalid GSC sites status");
  return { status, body: response.slice(separatorIndex + 1) };
};

const verifyPropertyAccess = async (
  token: string,
  property: string
): Promise<void> => {
  const { status, body } = parseSitesResponse(await listSites(token));
  if (status !== 200) {
    throw new Error(`GSC property verification failed: ${status} ${body}`);
  }
  const parsed: unknown = JSON.parse(body);
  const sites = SiteListSchema.parse(parsed).siteEntry ?? [];
  if (!sites.some(({ siteUrl }) => siteUrl === property)) {
    throw new Error(`GSC property access denied: ${property}`);
  }
};

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const createAuditDependencies = (): AuditDependencies => ({
  dataDir: DATA_DIR,
  clock: {
    now: () => new Date(),
    sleep,
    random: Math.random,
  },
  output: {
    stdout: (message) => console.log(message),
    stderr: (message) => console.error(message),
  },
  sitemap: { fetchXml: fetchSitemapXml },
  gsc: {
    authenticate: getAccessToken,
    verifyProperty: verifyPropertyAccess,
    inspect: inspectUrl,
  },
  eventStore: { append: appendEvent },
  createId: randomUUID,
});

const main = async (): Promise<void> => {
  const exitCode = await runAuditCommand(
    process.argv.slice(2),
    createAuditDependencies()
  );
  process.exitCode = exitCode;
};

void main();
