import { existsSync } from "fs";

import type { InspectOutcome } from "./gsc";
import {
  appendQuotaBasisTime,
  AUDIT_PROPERTY,
  type AuditEvent,
  buildSummary,
  createQuotaWindow,
  getAuditPaths,
  getCompletedUrls,
  getQuotaWindowState,
  type Inventory,
  loadInventory,
  MAX_ATTEMPTS_24H,
  type QuotaWindow,
  readEvents,
  saveInventory,
  saveSummary,
  updateLatestQuotaBasisTime,
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

export type AuditEventStore = {
  append: (filePath: string, event: AuditEvent) => Promise<void>;
};

export type AuditDependencies = {
  dataDir: string;
  clock: AuditClock;
  output: AuditOutput;
  sitemap: SitemapGateway;
  gsc: GscGateway;
  eventStore: AuditEventStore;
  createId: () => string;
};

type SecurityContext = {
  secrets: Set<string>;
};

export type RunAuditCommand = (
  args: string[],
  dependencies: AuditDependencies
) => Promise<number>;

export const MIN_REQUEST_INTERVAL_MS = 250;
export const RETRY_BASE_MS: [number, number] = [1000, 2000];
export const RETRY_JITTER_MS = 250;
export const ATTEMPT_RECORDING_SAFETY_MS = 60_000;
export const MAX_ERROR_LENGTH = 300;
export { AUDIT_PROPERTY, MAX_ATTEMPTS_24H };

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
const MODE_BY_FLAG: Record<string, AuditMode> = {
  "--init": "init",
  "--run": "run",
  "--summary": "summary",
};
const DELIMITED_AUTHORIZATION_SECRET_PATTERN =
  /\bAuthorization\s*[:=]\s*Bearer\s+\S+/gi;
const SPACED_AUTHORIZATION_SECRET_PATTERN = /\bAuthorization\s+Bearer\s+\S+/gi;
const NAMED_SECRET_PATTERN =
  /\b(?:credentials?|client[-_]secret|private[-_]key)\s*[:=\-]\s*\S+/gi;
const SECRET_KEYS = new Set([
  "authorization",
  "credential",
  "credentials",
  "client_secret",
  "client-secret",
  "private_key",
  "private-key",
]);
const PRIVATE_KEY_END_MARKER = "-----END PRIVATE KEY-----";

const getSitemapUrl = (index: SitemapIndex): string =>
  `https://www.recipio.kr/recipes/sitemap/${index}.xml`;

const parseMode = (args: string[]): AuditMode => {
  if (args.length === 1) {
    const mode = MODE_BY_FLAG[args[0]];
    if (mode !== undefined) return mode;
  }
  throw new Error("Usage: --init | --run | --summary");
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

const writeSummaryOutput = (
  summary: ReturnType<typeof buildSummary>,
  output: AuditOutput
): void => {
  const statusCounts = {
    indexed: summary.indexed,
    ...summary.coverageStateCounts,
  };
  output.stdout(
    `total=${summary.totalUrls} completed=${summary.completedUrls} pending=${summary.pendingUrls}`
  );
  output.stdout(`statusCounts=${JSON.stringify(statusCounts)}`);
  output.stdout(`apiFailureCounts=${JSON.stringify(summary.apiFailureCounts)}`);
  output.stdout(
    `recentAttempts=${summary.recentAttempts} nextAvailableAt=${summary.nextAvailableAt ?? "-"}`
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
  writeSummaryOutput(summary, dependencies.output);
};

type AuditResult = Extract<AuditEvent, { type: "result" }>;
type AuditAttempt = Extract<AuditEvent, { type: "attempt" }>;

type RequestPacer = {
  lastStartedAt: number | null;
};

type InspectionContext = {
  inventory: Inventory;
  token: string;
  events: AuditEvent[];
  pacer: RequestPacer;
  quotaWindow: QuotaWindow;
};

type InspectionResponse =
  | { kind: "received"; outcome: InspectOutcome }
  | { kind: "network_error"; error: string };

type InspectionRequest =
  | { kind: "requested"; response: InspectionResponse }
  | { kind: "recording_timeout" };

type AttemptDecision = "next_url" | "retry" | "stop" | "quota_exhausted";

type StartedAttempt =
  | { kind: "started"; attempt: ReservedAuditAttempt }
  | { kind: "quota_exhausted" };

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const replaceSecrets = (message: string, secrets: string[]): string =>
  secrets
    .filter((secret) => secret.length > 0)
    .reduce(
      (redacted, secret) => redacted.split(secret).join("[REDACTED]"),
      message
    );

type Quote = '"' | "'";

type QuotedSecretMatch = {
  valueEnd: number | null;
  valueQuote: Quote;
  valueStart: number;
};

const isQuote = (value: string | undefined): value is Quote =>
  value === '"' || value === "'";

const findQuotedEnd = (
  message: string,
  start: number,
  quote: Quote
): number | null => {
  let index = start + 1;
  while (index < message.length) {
    if (message[index] === "\\") {
      index += 2;
      continue;
    }
    if (message[index] === quote) return index;
    index += 1;
  }
  return null;
};

const isJsonWhitespace = (value: string | undefined): boolean =>
  value === " " || value === "\t" || value === "\r" || value === "\n";

const skipJsonWhitespace = (message: string, start: number): number => {
  let index = start;
  while (isJsonWhitespace(message[index])) index += 1;
  return index;
};

const getQuotedValueStart = (
  message: string,
  keyEnd: number
): number | null => {
  const colonIndex = skipJsonWhitespace(message, keyEnd + 1);
  if (message[colonIndex] !== ":") return null;
  const valueStart = skipJsonWhitespace(message, colonIndex + 1);
  return isQuote(message[valueStart]) ? valueStart : null;
};

const shouldRedactQuotedValue = (key: string, value: string): boolean => {
  if (!SECRET_KEYS.has(key)) return false;
  if (key !== "authorization") return true;
  return /^Bearer\s+/i.test(value.trimStart());
};

const getQuotedSecretMatch = (
  message: string,
  keyStart: number,
  keyEnd: number
): QuotedSecretMatch | null => {
  const key = message.slice(keyStart + 1, keyEnd).toLowerCase();
  const valueStart = getQuotedValueStart(message, keyEnd);
  if (valueStart === null) return null;
  const valueQuote = message[valueStart];
  if (!isQuote(valueQuote)) return null;
  const valueEnd = findQuotedEnd(message, valueStart, valueQuote);
  const value = message.slice(valueStart + 1, valueEnd ?? message.length);
  if (!shouldRedactQuotedValue(key, value)) return null;
  return { valueEnd, valueQuote, valueStart };
};

const findNextQuotedSecret = (
  message: string,
  start: number
): QuotedSecretMatch | null => {
  let index = start;
  while (index < message.length) {
    const keyQuote = message[index];
    if (!isQuote(keyQuote)) {
      index += 1;
      continue;
    }
    const keyEnd = findQuotedEnd(message, index, keyQuote);
    if (keyEnd === null) return null;
    const match = getQuotedSecretMatch(message, index, keyEnd);
    if (match !== null) return match;
    index = keyEnd + 1;
  }
  return null;
};

const redactQuotedSecrets = (message: string): string => {
  const chunks: string[] = [];
  let cursor = 0;
  while (cursor < message.length) {
    const match = findNextQuotedSecret(message, cursor);
    if (match === null) break;
    chunks.push(message.slice(cursor, match.valueStart + 1), "[REDACTED]");
    if (match.valueEnd === null) {
      cursor = message.length;
      break;
    }
    chunks.push(match.valueQuote);
    cursor = match.valueEnd + 1;
  }
  chunks.push(message.slice(cursor));
  return chunks.join("");
};

const redactPrivateKeyPems = (message: string): string => {
  const chunks: string[] = [];
  let cursor = 0;
  const starts = message.matchAll(
    /\bprivate[-_]key\s*[:=\-]\s*-----BEGIN PRIVATE KEY-----/gi
  );
  for (const match of starts) {
    if (match.index < cursor) continue;
    const endStart = message.indexOf(
      PRIVATE_KEY_END_MARKER,
      match.index + match[0].length
    );
    const end =
      endStart === -1
        ? message.length
        : endStart + PRIVATE_KEY_END_MARKER.length;
    chunks.push(message.slice(cursor, match.index), "[REDACTED]");
    cursor = end;
    if (endStart === -1) break;
  }
  chunks.push(message.slice(cursor));
  return chunks.join("");
};

export const redactSensitive = (
  message: string,
  secrets: string[] = []
): string =>
  redactPrivateKeyPems(redactQuotedSecrets(replaceSecrets(message, secrets)))
    .replace(DELIMITED_AUTHORIZATION_SECRET_PATTERN, "[REDACTED]")
    .replace(SPACED_AUTHORIZATION_SECRET_PATTERN, "[REDACTED]")
    .replace(NAMED_SECRET_PATTERN, "[REDACTED]")
    .slice(0, MAX_ERROR_LENGTH);

const getSecuritySecrets = (security: SecurityContext): string[] => [
  ...security.secrets,
];

const authenticateGsc = async (
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<string> => {
  try {
    const token = await dependencies.gsc.authenticate();
    security.secrets.add(token);
    return token;
  } catch (error) {
    throw new Error(
      redactSensitive(getErrorMessage(error), getSecuritySecrets(security))
    );
  }
};

const verifyGscProperty = async (
  token: string,
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<void> => {
  try {
    await dependencies.gsc.verifyProperty(token, AUDIT_PROPERTY);
  } catch (error) {
    throw new Error(
      redactSensitive(getErrorMessage(error), getSecuritySecrets(security))
    );
  }
};

const loadVerifiedToken = async (
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<string> => {
  const token = await authenticateGsc(dependencies, security);
  await verifyGscProperty(token, dependencies, security);
  return token;
};

const getFailureOutcome = (
  status: number | null
): Exclude<AuditResult["outcome"], "success"> => {
  if (status === 429) return "rate_limited";
  if (status === 401 || status === 403) return "auth_error";
  if (status === null || status >= 500) return "retryable_error";
  return "request_error";
};

const getAttemptDecision = (result: AuditResult): AttemptDecision => {
  if (result.outcome === "retryable_error") return "retry";
  if (result.outcome === "rate_limited" || result.outcome === "auth_error") {
    return "stop";
  }
  return "next_url";
};

type ResultIdentity = Pick<
  AuditResult,
  "type" | "auditId" | "attemptId" | "url" | "completedAt"
>;

const createResultIdentity = (
  context: InspectionContext,
  url: string,
  attemptId: string,
  completedAt: string
): ResultIdentity => ({
  type: "result",
  auditId: context.inventory.auditId,
  attemptId,
  url,
  completedAt,
});

const createNetworkErrorResult = (
  identity: ResultIdentity,
  error: string,
  token: string
): AuditResult => ({
  ...identity,
  outcome: "retryable_error",
  status: null,
  error: redactSensitive(error, [token]),
});

const createSuccessResult = (
  identity: ResultIdentity,
  outcome: InspectOutcome,
  token: string
): AuditResult => {
  const { error, ...fields } = outcome;
  const safeError =
    error === undefined ? {} : { error: redactSensitive(error, [token]) };
  return { ...identity, outcome: "success", ...fields, ...safeError };
};

const createReceivedResult = (
  identity: ResultIdentity,
  outcome: InspectOutcome,
  token: string
): AuditResult => {
  if (outcome.status === 200) {
    return createSuccessResult(identity, outcome, token);
  }
  return {
    ...identity,
    outcome: getFailureOutcome(outcome.status),
    status: outcome.status,
    error: redactSensitive(
      outcome.error ?? `GSC inspection failed: ${outcome.status}`,
      [token]
    ),
  };
};

const createResultEvent = (
  context: InspectionContext,
  url: string,
  attemptId: string,
  response: InspectionResponse,
  completedAt: string
): AuditResult => {
  const identity = createResultIdentity(context, url, attemptId, completedAt);
  if (response.kind === "network_error") {
    return createNetworkErrorResult(identity, response.error, context.token);
  }
  return createReceivedResult(identity, response.outcome, context.token);
};

const appendTrackedEvent = async (
  events: AuditEvent[],
  event: AuditEvent,
  dependencies: AuditDependencies
): Promise<void> => {
  await dependencies.eventStore.append(
    getAuditPaths(dependencies.dataDir).events,
    event
  );
  events.push(event);
};

const waitForRequestSlot = async (
  pacer: RequestPacer,
  clock: AuditClock
): Promise<void> => {
  if (pacer.lastStartedAt === null) return;
  const elapsed = clock.now().getTime() - pacer.lastStartedAt;
  const waitMs = MIN_REQUEST_INTERVAL_MS - elapsed;
  if (waitMs > 0) await clock.sleep(waitMs);
};

const waitForAttemptStart = async (
  pacer: RequestPacer,
  retryDelay: number,
  clock: AuditClock
): Promise<void> => {
  if (retryDelay > 0) await clock.sleep(retryDelay);
  await waitForRequestSlot(pacer, clock);
};

type ReservedAuditAttempt = AuditAttempt & { quotaBasisAt: string };

const createAttemptEvent = (
  context: InspectionContext,
  url: string,
  attemptId: string,
  startedAt: string
): ReservedAuditAttempt => ({
  type: "attempt",
  auditId: context.inventory.auditId,
  attemptId,
  url,
  startedAt,
  quotaBasisAt: new Date(
    Date.parse(startedAt) + ATTEMPT_RECORDING_SAFETY_MS
  ).toISOString(),
});

const startAttempt = async (
  context: InspectionContext,
  url: string,
  retryDelay: number,
  dependencies: AuditDependencies
): Promise<StartedAttempt> => {
  const rateWindow = getQuotaWindowState(
    context.quotaWindow,
    dependencies.clock.now(),
    MAX_ATTEMPTS_24H
  );
  if (rateWindow.recentAttempts >= MAX_ATTEMPTS_24H) {
    return { kind: "quota_exhausted" };
  }
  await waitForAttemptStart(context.pacer, retryDelay, dependencies.clock);
  const attemptId = dependencies.createId();
  const startedAt = dependencies.clock.now().toISOString();
  const attempt = createAttemptEvent(context, url, attemptId, startedAt);
  await appendTrackedEvent(context.events, attempt, dependencies);
  appendQuotaBasisTime(context.quotaWindow, Date.parse(attempt.quotaBasisAt));
  return { kind: "started", attempt };
};

const requestInspection = async (
  context: InspectionContext,
  url: string,
  attempt: ReservedAuditAttempt,
  dependencies: AuditDependencies
): Promise<InspectionRequest> => {
  const actualStartedAt = dependencies.clock.now().getTime();
  if (actualStartedAt > Date.parse(attempt.quotaBasisAt)) {
    return { kind: "recording_timeout" };
  }
  context.pacer.lastStartedAt = actualStartedAt;
  try {
    const outcome = await dependencies.gsc.inspect(
      context.token,
      AUDIT_PROPERTY,
      url
    );
    return { kind: "requested", response: { kind: "received", outcome } };
  } catch (error) {
    return {
      kind: "requested",
      response: {
        kind: "network_error",
        error: redactSensitive(getErrorMessage(error), [context.token]),
      },
    };
  }
};

const requestAndRecordAttempt = async (
  context: InspectionContext,
  url: string,
  attempt: ReservedAuditAttempt,
  dependencies: AuditDependencies
): Promise<AttemptDecision> => {
  const request = await requestInspection(context, url, attempt, dependencies);
  if (request.kind === "recording_timeout") return "stop";
  const result = createResultEvent(
    context,
    url,
    attempt.attemptId,
    request.response,
    dependencies.clock.now().toISOString()
  );
  await appendTrackedEvent(context.events, result, dependencies);
  updateLatestQuotaBasisTime(
    context.quotaWindow,
    Date.parse(result.completedAt)
  );
  return getAttemptDecision(result);
};

const executeAttempt = async (
  context: InspectionContext,
  url: string,
  retryDelay: number,
  dependencies: AuditDependencies
): Promise<AttemptDecision> => {
  const started = await startAttempt(context, url, retryDelay, dependencies);
  if (started.kind === "quota_exhausted") return "quota_exhausted";
  return requestAndRecordAttempt(context, url, started.attempt, dependencies);
};

const getRetryDelay = (retryIndex: number, random: number): number => {
  const base = retryIndex === 0 ? RETRY_BASE_MS[0] : RETRY_BASE_MS[1];
  return base + Math.floor(random * RETRY_JITTER_MS);
};

const inspectPendingUrl = async (
  context: InspectionContext,
  url: string,
  dependencies: AuditDependencies
): Promise<AttemptDecision> => {
  for (
    let attemptIndex = 0;
    attemptIndex <= RETRY_BASE_MS.length;
    attemptIndex += 1
  ) {
    const retryDelay =
      attemptIndex === 0
        ? 0
        : getRetryDelay(attemptIndex - 1, dependencies.clock.random());
    const decision = await executeAttempt(
      context,
      url,
      retryDelay,
      dependencies
    );
    if (decision !== "retry") return decision;
  }
  return "next_url";
};

type PendingInspection = {
  inventory: Inventory;
  urls: string[];
  events: AuditEvent[];
};

const loadPendingInspection = async (
  dependencies: AuditDependencies
): Promise<PendingInspection> => {
  const paths = getAuditPaths(dependencies.dataDir);
  const [inventory, events] = await Promise.all([
    loadInventory(paths.inventory),
    readEvents(paths.events),
  ]);
  const completedUrls = getCompletedUrls(events, inventory.auditId);
  const urls = inventory.urls
    .map(({ url }) => url)
    .filter((url) => !completedUrls.has(url));
  return { inventory, urls, events };
};

const hasAttemptAllowance = (
  quotaWindow: QuotaWindow,
  clock: AuditClock
): boolean =>
  getQuotaWindowState(quotaWindow, clock.now(), MAX_ATTEMPTS_24H)
    .recentAttempts < MAX_ATTEMPTS_24H;

const inspectPendingUrls = async (
  pending: PendingInspection,
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<void> => {
  if (pending.urls.length === 0) return;
  const quotaWindow = createQuotaWindow(pending.events);
  if (!hasAttemptAllowance(quotaWindow, dependencies.clock)) return;
  const token = await loadVerifiedToken(dependencies, security);
  const context: InspectionContext = {
    inventory: pending.inventory,
    token,
    events: pending.events,
    pacer: { lastStartedAt: null },
    quotaWindow,
  };
  for (const url of pending.urls) {
    const decision = await inspectPendingUrl(context, url, dependencies);
    if (decision === "stop" || decision === "quota_exhausted") return;
  }
};

const processPendingInspection = async (
  pending: PendingInspection,
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<void> => {
  await inspectPendingUrls(pending, dependencies, security);
  await saveCurrentSummary(pending.inventory, dependencies);
};

const runNextInspection = async (
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<void> => {
  const pending = await loadPendingInspection(dependencies);
  await processPendingInspection(pending, dependencies, security);
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
  dependencies: AuditDependencies,
  security: SecurityContext
): Promise<void> => {
  if (mode === "init") return initializeAudit(dependencies);
  if (mode === "run") return runNextInspection(dependencies, security);
  return regenerateSummary(dependencies);
};

export const runAuditCommand: RunAuditCommand = async (
  args: string[],
  dependencies: AuditDependencies
) => {
  const security: SecurityContext = { secrets: new Set() };
  try {
    const mode = parseMode(args);
    await executeMode(mode, dependencies, security);
    return 0;
  } catch (error) {
    dependencies.output.stderr(
      redactSensitive(getErrorMessage(error), getSecuritySecrets(security))
    );
    return 1;
  }
};
