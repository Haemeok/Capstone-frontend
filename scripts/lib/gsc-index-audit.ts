import { existsSync } from "fs";

import type { InspectOutcome } from "./gsc";
import {
  appendEvent,
  AUDIT_PROPERTY,
  buildSummary,
  getAuditPaths,
  type Inventory,
  loadInventory,
  readEvents,
  saveInventory,
  saveSummary,
} from "./gsc-index-audit-store";

export type AuditMode = "init" | "run" | "summary";
export type SitemapIndex = 0 | 1 | 2 | 3;

export type AuditClock = {
  now: () => Date;
  sleep: (milliseconds: number) => Promise<void>;
  random: () => number;
};

export type AuditOutput = {
  stdout: (message: string) => void;
  stderr: (message: string) => void;
};

export type SitemapGateway = {
  fetchXml: (index: SitemapIndex) => Promise<string>;
};

export type GscGateway = {
  authenticate: () => Promise<string>;
  verifyProperty: (token: string, property: string) => Promise<void>;
  inspect: (
    token: string,
    property: string,
    url: string
  ) => Promise<InspectOutcome>;
};

export type AuditDependencies = {
  dataDir: string;
  clock: AuditClock;
  output: AuditOutput;
  sitemap: SitemapGateway;
  gsc: GscGateway;
  createId: () => string;
};

export type RunAuditCommand = (
  args: string[],
  dependencies: AuditDependencies
) => Promise<number>;

export const MAX_ATTEMPTS_24H = 1800;
export const MIN_REQUEST_INTERVAL_MS = 250;
export const RETRY_BASE_MS = [1000, 2000];
export const RETRY_JITTER_MS = 250;
export { AUDIT_PROPERTY };

const SITEMAP_INDEXES: SitemapIndex[] = [0, 1, 2, 3];
const RESERVED_RECIPE_SEGMENTS = new Set([
  "new",
  "my-fridge",
  "admin",
  "category",
  "private",
  "sitemap",
  "dyn",
]);

const getSitemapUrl = (index: SitemapIndex): string =>
  `https://www.recipio.kr/recipes/sitemap/${index}.xml`;

const getMode = (args: string[]): AuditMode => {
  if (args.includes("--init")) return "init";
  if (args.includes("--run")) return "run";
  if (args.includes("--summary")) return "summary";
  throw new Error("--init, --run, --summary 중 하나가 필요합니다.");
};

const extractSitemapUrls = (xml: string): string[] =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());

const isRecipeDetailUrl = (rawUrl: string): boolean => {
  try {
    const url = new URL(rawUrl);
    const match = url.pathname.match(/^\/recipes\/([^/]+)$/);
    return (
      url.origin === "https://www.recipio.kr" &&
      url.search === "" &&
      url.hash === "" &&
      match !== null &&
      !RESERVED_RECIPE_SEGMENTS.has(match[1])
    );
  } catch {
    return false;
  }
};

type FetchedSitemap = {
  index: SitemapIndex;
  url: string;
  urls: string[];
};

const fetchSitemap = async (
  index: SitemapIndex,
  gateway: SitemapGateway
): Promise<FetchedSitemap> => {
  const xml = await gateway.fetchXml(index);
  const urls = extractSitemapUrls(xml);
  if (urls.length === 0) throw new Error(`sitemap ${index} is empty`);
  const invalidUrl = urls.find((url) => !isRecipeDetailUrl(url));
  if (invalidUrl !== undefined) {
    throw new Error(`sitemap ${index} has invalid recipe URL: ${invalidUrl}`);
  }
  return {
    index,
    url: getSitemapUrl(index),
    urls,
  };
};

const fetchSitemaps = (gateway: SitemapGateway): Promise<FetchedSitemap[]> =>
  Promise.all(SITEMAP_INDEXES.map((index) => fetchSitemap(index, gateway)));

const buildInventoryUrls = (sitemaps: FetchedSitemap[]) => {
  const urlIndexes = new Map<string, SitemapIndex[]>();
  sitemaps.forEach(({ index, urls }) => {
    urls.forEach((url) => {
      const indexes = urlIndexes.get(url) ?? [];
      if (!indexes.includes(index)) indexes.push(index);
      urlIndexes.set(url, indexes);
    });
  });
  return [...urlIndexes.entries()].map(([url, sitemapIndexes]) => ({
    url,
    sitemapIndexes,
  }));
};

const buildInventory = (
  sitemaps: FetchedSitemap[],
  dependencies: AuditDependencies
): Inventory => {
  const urls = buildInventoryUrls(sitemaps);
  const totalRows = sitemaps.reduce(
    (sum, source) => sum + source.urls.length,
    0
  );
  return {
    auditId: dependencies.createId(),
    createdAt: dependencies.clock.now().toISOString(),
    property: AUDIT_PROPERTY,
    sources: sitemaps.map(({ index, url, urls: sourceUrls }) => ({
      index,
      url,
      rowCount: sourceUrls.length,
    })),
    duplicateRows: totalRows - urls.length,
    urls,
  };
};

const initializeAudit = async (
  dependencies: AuditDependencies
): Promise<void> => {
  const paths = getAuditPaths(dependencies.dataDir);
  if (existsSync(paths.inventory)) {
    throw new Error("inventory.json이 이미 존재합니다.");
  }
  const inventory = buildInventory(
    await fetchSitemaps(dependencies.sitemap),
    dependencies
  );
  await saveInventory(paths.inventory, inventory);
  const rows = inventory.sources.reduce(
    (sum, source) => sum + source.rowCount,
    0
  );
  dependencies.output.stdout(
    `rows=${rows} duplicates=${inventory.duplicateRows} unique=${inventory.urls.length}`
  );
};

const saveCurrentSummary = async (
  inventory: Inventory,
  dependencies: AuditDependencies
): Promise<void> => {
  const paths = getAuditPaths(dependencies.dataDir);
  const events = await readEvents(paths.events);
  const summary = buildSummary(
    inventory,
    events,
    dependencies.clock.now().toISOString()
  );
  await saveSummary(paths.summary, summary);
};

const loadPendingUrl = async (
  inventory: Inventory,
  dependencies: AuditDependencies
): Promise<string | null> => {
  const events = await readEvents(getAuditPaths(dependencies.dataDir).events);
  const completedUrls = new Set(
    events
      .filter(
        (event) =>
          event.type === "result" &&
          event.outcome === "success" &&
          event.auditId === inventory.auditId
      )
      .map(({ url }) => url)
  );
  return inventory.urls.find(({ url }) => !completedUrls.has(url))?.url ?? null;
};

const loadVerifiedToken = async (
  dependencies: AuditDependencies
): Promise<string> => {
  const token = await dependencies.gsc.authenticate();
  await dependencies.gsc.verifyProperty(token, AUDIT_PROPERTY);
  return token;
};

type AttemptContext = {
  inventory: Inventory;
  attemptId: string;
  url: string;
  token: string;
};

const completeAttempt = async (
  context: AttemptContext,
  dependencies: AuditDependencies
): Promise<void> => {
  const outcome = await dependencies.gsc.inspect(
    context.token,
    AUDIT_PROPERTY,
    context.url
  );
  if (outcome.status !== 200) {
    throw new Error(`GSC inspection failed: ${outcome.status}`);
  }
  await appendEvent(getAuditPaths(dependencies.dataDir).events, {
    type: "result",
    auditId: context.inventory.auditId,
    attemptId: context.attemptId,
    url: context.url,
    completedAt: dependencies.clock.now().toISOString(),
    outcome: "success",
    ...outcome,
  });
};

const inspectPendingUrl = async (
  inventory: Inventory,
  url: string,
  token: string,
  dependencies: AuditDependencies
): Promise<void> => {
  const attemptId = dependencies.createId();
  await appendEvent(getAuditPaths(dependencies.dataDir).events, {
    type: "attempt",
    auditId: inventory.auditId,
    attemptId,
    url,
    startedAt: dependencies.clock.now().toISOString(),
  });
  await completeAttempt({ inventory, attemptId, url, token }, dependencies);
};

const processInspection = async (
  inventory: Inventory,
  url: string,
  dependencies: AuditDependencies
): Promise<void> => {
  const token = await loadVerifiedToken(dependencies);
  await inspectPendingUrl(inventory, url, token, dependencies);
};

type PendingInspection = {
  inventory: Inventory;
  url: string | null;
};

const loadPendingInspection = async (
  dependencies: AuditDependencies
): Promise<PendingInspection> => {
  const inventory = await loadInventory(
    getAuditPaths(dependencies.dataDir).inventory
  );
  const url = await loadPendingUrl(inventory, dependencies);
  return { inventory, url };
};

const processPendingInspection = async (
  pending: PendingInspection,
  dependencies: AuditDependencies
): Promise<void> => {
  if (pending.url !== null) {
    await processInspection(pending.inventory, pending.url, dependencies);
  }
  await saveCurrentSummary(pending.inventory, dependencies);
};

const runNextInspection = async (
  dependencies: AuditDependencies
): Promise<void> => {
  const pending = await loadPendingInspection(dependencies);
  await processPendingInspection(pending, dependencies);
};

const regenerateSummary = async (
  dependencies: AuditDependencies
): Promise<void> => {
  const inventory = await loadInventory(
    getAuditPaths(dependencies.dataDir).inventory
  );
  await saveCurrentSummary(inventory, dependencies);
};

const executeMode = async (
  mode: AuditMode,
  dependencies: AuditDependencies
): Promise<void> => {
  if (mode === "init") return initializeAudit(dependencies);
  if (mode === "run") return runNextInspection(dependencies);
  return regenerateSummary(dependencies);
};

export const runAuditCommand: RunAuditCommand = async (
  args: string[],
  dependencies: AuditDependencies
) => {
  try {
    await executeMode(getMode(args), dependencies);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    dependencies.output.stderr(message);
    return 1;
  }
};
