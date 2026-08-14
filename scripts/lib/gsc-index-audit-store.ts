import { appendFile, mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";

export const AUDIT_PROPERTY = "sc-domain:recipio.kr";

const SitemapIndexSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

const IndexFieldsSchema = z.object({
  verdict: z.string().optional(),
  coverageState: z.string().optional(),
  indexingState: z.string().optional(),
  robotsTxtState: z.string().optional(),
  pageFetchState: z.string().optional(),
  lastCrawlTime: z.string().optional(),
  googleCanonical: z.string().optional(),
  userCanonical: z.string().optional(),
  crawledAs: z.string().optional(),
  referringUrls: z.array(z.string()).optional(),
  sitemaps: z.array(z.string()).optional(),
});

export const InventorySchema = z.object({
  auditId: z.string().min(1),
  createdAt: z.string().datetime(),
  property: z.literal(AUDIT_PROPERTY),
  sources: z
    .array(
      z.object({
        index: SitemapIndexSchema,
        url: z.string().url(),
        rowCount: z.number().int().nonnegative(),
      })
    )
    .length(4)
    .refine(
      (sources) => new Set(sources.map(({ index }) => index)).size === 4,
      "sources must contain sitemap indexes 0, 1, 2, and 3 exactly once"
    ),
  duplicateRows: z.number().int().nonnegative(),
  urls: z.array(
    z.object({
      url: z.string().url(),
      sitemapIndexes: z.array(SitemapIndexSchema).min(1),
    })
  ),
});

const AuditAttemptSchema = z.object({
  type: z.literal("attempt"),
  auditId: z.string().min(1),
  attemptId: z.string().min(1),
  url: z.string().url(),
  startedAt: z.string().datetime(),
});

const AuditResultSchema = z
  .object({
    type: z.literal("result"),
    auditId: z.string().min(1),
    attemptId: z.string().min(1),
    url: z.string().url(),
    completedAt: z.string().datetime(),
    outcome: z.enum([
      "success",
      "rate_limited",
      "auth_error",
      "request_error",
      "retryable_error",
    ]),
    status: z.number().int().nonnegative(),
    error: z.string().optional(),
  })
  .extend(IndexFieldsSchema.shape);

export const AuditEventSchema = z.discriminatedUnion("type", [
  AuditAttemptSchema,
  AuditResultSchema,
]);

export const SummarySchema = z.object({
  auditId: z.string().min(1),
  generatedAt: z.string().datetime(),
  property: z.literal(AUDIT_PROPERTY),
  totalUrls: z.number().int().nonnegative(),
  completedUrls: z.number().int().nonnegative(),
  pendingUrls: z.number().int().nonnegative(),
  indexed: z.number().int().nonnegative(),
  coverageStateCounts: z.record(z.string(), z.number().int().nonnegative()),
  apiFailureCounts: z.record(z.string(), z.number().int().nonnegative()),
  firstCheckedAt: z.string().datetime().nullable(),
  lastCheckedAt: z.string().datetime().nullable(),
  recentAttempts: z.number().int().nonnegative(),
  nextAvailableAt: z.string().datetime().nullable(),
});

export type Inventory = z.infer<typeof InventorySchema>;
export type AuditEvent = z.infer<typeof AuditEventSchema>;
export type Summary = z.infer<typeof SummarySchema>;

export const getAuditPaths = (dataDir: string) => ({
  inventory: path.join(dataDir, "inventory.json"),
  events: path.join(dataDir, "events.jsonl"),
  summary: path.join(dataDir, "summary.json"),
});

const writeTemporaryJson = async (
  temporaryPath: string,
  value: unknown
): Promise<void> => {
  await mkdir(path.dirname(temporaryPath), { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

export const writeJsonAtomic = async (
  filePath: string,
  value: unknown
): Promise<void> => {
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeTemporaryJson(temporaryPath, value);
  await rename(temporaryPath, filePath);
};

export const loadInventory = async (filePath: string): Promise<Inventory> => {
  const content = await readFile(filePath, "utf8");
  return InventorySchema.parse(JSON.parse(content));
};

export const saveInventory = async (
  filePath: string,
  inventory: Inventory
): Promise<void> => writeJsonAtomic(filePath, InventorySchema.parse(inventory));

export const appendEvent = async (
  filePath: string,
  event: AuditEvent
): Promise<void> => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(
    filePath,
    `${JSON.stringify(AuditEventSchema.parse(event))}\n`,
    "utf8"
  );
};

const hasErrorCode = (error: unknown): error is { code: string } =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  typeof error.code === "string";

const parseEventLine = (line: string, index: number): AuditEvent => {
  try {
    return AuditEventSchema.parse(JSON.parse(line));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`events.jsonl line ${index + 1}: ${reason}`);
  }
};

export const readEvents = async (filePath: string): Promise<AuditEvent[]> => {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (hasErrorCode(error) && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
  const events: AuditEvent[] = [];
  content.split(/\r?\n/).forEach((line, index) => {
    if (line.trim().length > 0) events.push(parseEventLine(line, index));
  });
  return events;
};

const getLatestSuccesses = (inventory: Inventory, events: AuditEvent[]) => {
  const successes = new Map<string, Extract<AuditEvent, { type: "result" }>>();
  const inventoryUrls = new Set(inventory.urls.map(({ url }) => url));
  events.forEach((event) => {
    if (
      event.type === "result" &&
      event.outcome === "success" &&
      event.auditId === inventory.auditId &&
      inventoryUrls.has(event.url)
    ) {
      successes.set(event.url, event);
    }
  });
  return successes;
};

export const getCompletedUrls = (
  events: AuditEvent[],
  auditId: string
): Set<string> =>
  new Set(
    events
      .filter(
        (event) =>
          event.type === "result" &&
          event.outcome === "success" &&
          event.auditId === auditId
      )
      .map(({ url }) => url)
  );

export const getRecentAttempts = (events: AuditEvent[], now: Date): number => {
  const cutoff = now.getTime() - 24 * 60 * 60 * 1000;
  return events.filter(
    (event) =>
      event.type === "attempt" && new Date(event.startedAt).getTime() > cutoff
  ).length;
};

const getCoverageStateCounts = (
  successes: Map<string, Extract<AuditEvent, { type: "result" }>>
): Record<string, number> => {
  const counts: Record<string, number> = {};
  successes.forEach((result) => {
    if (result.verdict === "PASS") return;
    const state = result.coverageState ?? "(coverageState 없음)";
    counts[state] = (counts[state] ?? 0) + 1;
  });
  return counts;
};

type AuditResult = Extract<AuditEvent, { type: "result" }>;

const getPendingInventoryUrls = (
  inventory: Inventory,
  completedUrls: Set<string>
): Set<string> =>
  new Set(
    inventory.urls
      .map(({ url }) => url)
      .filter((url) => !completedUrls.has(url))
  );

const getLatestFailures = (
  events: AuditEvent[],
  auditId: string,
  pendingUrls: Set<string>
): Map<string, AuditResult> => {
  const failures = new Map<string, AuditResult>();
  events.forEach((event) => {
    if (
      event.type === "result" &&
      event.outcome !== "success" &&
      event.auditId === auditId &&
      pendingUrls.has(event.url)
    ) {
      failures.set(event.url, event);
    }
  });
  return failures;
};

const countFailureOutcomes = (
  failures: Map<string, AuditResult>
): Record<string, number> => {
  const counts: Record<string, number> = {};
  failures.forEach(({ outcome }) => {
    counts[outcome] = (counts[outcome] ?? 0) + 1;
  });
  return counts;
};

const getApiFailureCounts = (
  inventory: Inventory,
  events: AuditEvent[],
  completedUrls: Set<string>
): Record<string, number> => {
  const pendingUrls = getPendingInventoryUrls(inventory, completedUrls);
  const failures = getLatestFailures(events, inventory.auditId, pendingUrls);
  return countFailureOutcomes(failures);
};

const getCheckedAtRange = (
  successes: Map<string, Extract<AuditEvent, { type: "result" }>>
): Pick<Summary, "firstCheckedAt" | "lastCheckedAt"> => {
  const completedAt = [...successes.values()]
    .map((result) => result.completedAt)
    .sort((left, right) => Date.parse(left) - Date.parse(right));
  return {
    firstCheckedAt: completedAt[0] ?? null,
    lastCheckedAt: completedAt[completedAt.length - 1] ?? null,
  };
};

export const buildSummary = (
  inventory: Inventory,
  events: AuditEvent[],
  generatedAt: string
): Summary => {
  const successes = getLatestSuccesses(inventory, events);
  const completedUrlSet = getCompletedUrls(events, inventory.auditId);
  const completedUrls = successes.size;
  const indexed = [...successes.values()].filter(
    ({ verdict }) => verdict === "PASS"
  ).length;
  return SummarySchema.parse({
    auditId: inventory.auditId,
    generatedAt,
    property: inventory.property,
    totalUrls: inventory.urls.length,
    completedUrls,
    pendingUrls: inventory.urls.length - completedUrls,
    indexed,
    coverageStateCounts: getCoverageStateCounts(successes),
    apiFailureCounts: getApiFailureCounts(inventory, events, completedUrlSet),
    ...getCheckedAtRange(successes),
    recentAttempts: getRecentAttempts(events, new Date(generatedAt)),
    nextAvailableAt: null,
  });
};

export const saveSummary = async (
  filePath: string,
  summary: Summary
): Promise<void> => writeJsonAtomic(filePath, SummarySchema.parse(summary));
