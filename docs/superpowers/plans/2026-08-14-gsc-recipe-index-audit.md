# GSC Recipe Index Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 레시피 sitemap 0~3의 고유 URL을 GSC URL Inspection API로 안전하게 전수 조사하고, 여러 날에 걸쳐 재개 가능한 로컬 상태와 색인 상태별 개수 요약을 만든다.

**Architecture:** 추적되는 CLI entry는 기존 GSC 인증·Inspection 모듈을 실제 네트워크 adapter로 연결한다. 명령 조율 모듈은 외부 네트워크·시간·출력을 주입받아 순차 호출, rolling 24시간 호출 여유, 재시도와 중단 정책을 담당하고, 저장소 모듈은 Git에서 무시되는 `docs/gsc-index-status/`의 inventory·JSONL 이벤트·summary를 검증하고 원자적으로 기록한다.

**Tech Stack:** TypeScript, Node.js `fs/path/crypto`, Zod 4, Jest 30, 기존 `scripts/lib/gsc.ts`, `tsx`

**Design:** `docs/superpowers/specs/2026-08-14-gsc-recipe-index-audit-design.md`

**Slices:** `docs/superpowers/specs/2026-08-14-gsc-recipe-index-audit-slices.md`

**Test design:** `docs/superpowers/specs/2026-08-14-gsc-recipe-index-audit-test-design.md`

---

## 실행 전 기준선 확인

- [ ] 현재 브랜치와 변경 상태를 다시 확인한다.

Run:

```powershell
git log -3 --oneline
git status --short
```

Expected:

- 현재 사용자가 선택한 브랜치에서만 작업한다.
- 기존 `AGENTS.md`, `.agents/skills/posthog-analytics/SKILL.md`, `.superpowers/` 등 다른 작업의 변경은 수정하거나 스테이징하지 않는다.
- 병렬 변경으로 이미 같은 기능이 들어갔다면 이 계획을 그대로 실행하지 않고 실제 차이만 다시 계산한다.

## 파일 구조

- Create: `scripts/lib/gsc-index-audit-store.ts`
  - runtime schema, inventory·event·summary 타입, 파일 읽기·append·원자적 쓰기, 최신 성공 결과 집계를 담당한다.
- Create: `scripts/lib/gsc-index-audit.ts`
  - 명령 파싱, sitemap 초기화, 재개, 호출 여유, 요청 간격, 재시도·중단 정책을 담당한다.
- Create: `scripts/gsc-recipe-index-audit.ts`
  - 실제 sitemap fetch, 기존 GSC 인증·property 확인·Inspection 함수를 조율 모듈에 연결한다.
- Create: `scripts/__tests__/gsc-recipe-index-audit.test.ts`
  - T-01~T-20 acceptance 시나리오를 Node 임시 디렉터리에서 검증한다.
- Modify: `package.json`
  - `seo:index-audit` 명령을 추가한다.
- Runtime only, ignored: `docs/gsc-index-status/inventory.json`
- Runtime only, ignored: `docs/gsc-index-status/events.jsonl`
- Runtime only, ignored: `docs/gsc-index-status/summary.json`

## 고정 계약

모든 작업은 다음 공개 계약을 유지한다.

```ts
export type AuditMode = "init" | "run" | "summary";

export type AuditClock = {
  now: () => Date;
  sleep: (ms: number) => Promise<void>;
  random: () => number;
};

export type AuditOutput = {
  stdout: (message: string) => void;
  stderr: (message: string) => void;
};

export type SitemapGateway = {
  fetchXml: (sitemapIndex: number) => Promise<string>;
};

export type GscGateway = {
  authenticate: () => Promise<string>;
  verifyProperty: (token: string) => Promise<{ status: number; hasProperty: boolean; error?: string }>;
  inspect: (token: string, url: string) => Promise<InspectOutcome>;
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
```

`runAuditCommand`는 예외를 사용자 출력과 종료 코드로 번역하는 acceptance seam이다. 외부 모듈 전체를 mock하지 않고 sitemap·GSC·시간·출력만 system edge로 주입한다.

### Task 1: 첫 URL을 검사하고 상태 집계를 확인한다

**Tests:** T-01, T-03, T-04

**Files:**

- Create: `scripts/lib/gsc-index-audit-store.ts`
- Create: `scripts/lib/gsc-index-audit.ts`
- Create: `scripts/__tests__/gsc-recipe-index-audit.test.ts`

- [ ] **Step 1: 임시 데이터 디렉터리와 edge adapter를 만드는 테스트 harness를 작성한다.**

```ts
/** @jest-environment node */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import {
  MIN_REQUEST_INTERVAL_MS,
  runAuditCommand,
  type AuditDependencies,
} from "../lib/gsc-index-audit";
import {
  appendEvent,
  getAuditPaths,
  InventorySchema,
  readEvents,
  saveInventory,
  SummarySchema,
} from "../lib/gsc-index-audit-store";

const NOW = new Date("2026-08-14T12:00:00.000Z");

const sitemapXml = (...urls: string[]) =>
  `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;

type HarnessState = {
  id: number;
  inspectionUrls: string[];
  nowMs: number;
  sitemapCalls: number[];
  sleeps: number[];
  stderr: string[];
  stdout: string[];
};

const createClock = (state: HarnessState): AuditDependencies["clock"] => ({
  now: () => new Date(state.nowMs),
  sleep: async (ms) => {
    state.sleeps.push(ms);
    state.nowMs += ms;
  },
  random: () => 0.5,
});

const createSitemapGateway = (state: HarnessState): AuditDependencies["sitemap"] => ({
  fetchXml: async (sitemapIndex) => {
    state.sitemapCalls.push(sitemapIndex);
    return sitemapXml(`https://www.recipio.kr/recipes/${sitemapIndex}`);
  },
});

const createGscGateway = (state: HarnessState): AuditDependencies["gsc"] => ({
  authenticate: async () => "token-test",
  verifyProperty: async () => ({ status: 200, hasProperty: true }),
  inspect: async (_token, url) => {
    state.inspectionUrls.push(url);
    return { status: 200, verdict: "PASS", coverageState: "URL is on Google" };
  },
});

const createDependencies = (
  dataDir: string,
  state: HarnessState
): AuditDependencies => ({
  dataDir,
  clock: createClock(state),
  output: {
    stdout: (message) => state.stdout.push(message),
    stderr: (message) => state.stderr.push(message),
  },
  sitemap: createSitemapGateway(state),
  gsc: createGscGateway(state),
  createId: () => `id-${++state.id}`,
});

const createHarness = () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-index-audit-"));
  const state: HarnessState = {
    id: 0,
    inspectionUrls: [],
    nowMs: NOW.getTime(),
    sitemapCalls: [],
    sleeps: [],
    stderr: [],
    stdout: [],
  };
  return {
    dataDir,
    dependencies: createDependencies(dataDir, state),
    elapsedMs: () => state.nowMs - NOW.getTime(),
    inspectionUrls: state.inspectionUrls,
    sitemapCalls: state.sitemapCalls,
    sleeps: state.sleeps,
    stderr: state.stderr,
    stdout: state.stdout,
  };
};
```

- [ ] **Step 2: T-01 failing test를 작성한다.**

```ts
it("T-01: sitemap 사이 중복은 조사 대상 하나로 합치고 출처 index는 보존한다", async () => {
  const harness = createHarness();
  const pages = [
    ["A", "B"],
    ["B", "C"],
    ["D"],
    ["E"],
  ];
  harness.dependencies.sitemap.fetchXml = async (index) =>
    sitemapXml(...pages[index].map((id) => `https://www.recipio.kr/recipes/${id}`));

  expect(await runAuditCommand(["--init"], harness.dependencies)).toBe(0);

  const paths = getAuditPaths(harness.dataDir);
  const inventory = InventorySchema.parse(JSON.parse(fs.readFileSync(paths.inventory, "utf8")));
  expect(inventory.sources.map((source) => source.rowCount)).toEqual([2, 2, 1, 1]);
  expect(inventory.duplicateRows).toBe(1);
  expect(inventory.urls).toHaveLength(5);
  expect(inventory.urls.find((entry) => entry.url.endsWith("/B"))?.sitemapIndexes).toEqual([0, 1]);
});
```

- [ ] **Step 3: T-01을 실행해 구현 부재로 실패하는지 확인한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-01" --runInBand
```

Expected: FAIL with `Cannot find module '../lib/gsc-index-audit'`.

- [ ] **Step 4: store의 runtime schema와 원자적 inventory 저장을 구현한다.**

`scripts/lib/gsc-index-audit-store.ts`에 다음 계약을 구현한다.

```ts
import * as fs from "fs";
import * as path from "path";

import { z } from "zod";

const SitemapIndexSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

export const InventorySchema = z.object({
  auditId: z.string().min(1),
  createdAt: z.string().datetime(),
  property: z.literal("sc-domain:recipio.kr"),
  sources: z.array(
    z.object({ sitemapIndex: SitemapIndexSchema, url: z.string().url(), rowCount: z.number().int().nonnegative() })
  ).length(4),
  duplicateRows: z.number().int().nonnegative(),
  urls: z.array(
    z.object({ url: z.string().url(), sitemapIndexes: z.array(SitemapIndexSchema).min(1) })
  ).min(1),
});

const AttemptEventSchema = z.object({
  type: z.literal("attempt"),
  attemptId: z.string().min(1),
  auditId: z.string().min(1),
  url: z.string().url(),
  attemptedAt: z.string().datetime(),
});

const ResultEventSchema = z.object({
  type: z.literal("result"),
  attemptId: z.string().min(1),
  auditId: z.string().min(1),
  url: z.string().url(),
  completedAt: z.string().datetime(),
  httpStatus: z.number().int().nullable(),
  outcome: z.enum(["success", "rate_limited", "auth_error", "request_error", "retryable_error"]),
  verdict: z.string().optional(),
  coverageState: z.string().optional(),
  indexingState: z.string().optional(),
  robotsTxtState: z.string().optional(),
  pageFetchState: z.string().optional(),
  lastCrawlTime: z.string().optional(),
  googleCanonical: z.string().optional(),
  userCanonical: z.string().optional(),
  crawledAs: z.string().optional(),
  error: z.string().optional(),
});

export const AuditEventSchema = z.discriminatedUnion("type", [AttemptEventSchema, ResultEventSchema]);

export const SummarySchema = z.object({
  auditId: z.string(),
  generatedAt: z.string().datetime(),
  total: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
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

export const writeJsonAtomic = (filePath: string, value: unknown) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, filePath);
};

export const loadInventory = (filePath: string): Inventory =>
  InventorySchema.parse(JSON.parse(fs.readFileSync(filePath, "utf8")));

export const saveInventory = (filePath: string, inventory: Inventory) =>
  writeJsonAtomic(filePath, InventorySchema.parse(inventory));
```

- [ ] **Step 5: sitemap 파싱과 `--init` walking skeleton을 구현한다.**

`scripts/lib/gsc-index-audit.ts`에 고정 상수와 다음 함수를 구현한다.

```ts
import * as fs from "fs";

import type { InspectOutcome } from "./gsc";
import { getAuditPaths, saveInventory, type Inventory } from "./gsc-index-audit-store";

export const AUDIT_PROPERTY = "sc-domain:recipio.kr";
export const MAX_ATTEMPTS_24H = 1800;
export const MIN_REQUEST_INTERVAL_MS = 250;
export const RETRY_BASE_MS = [1000, 2000];
export const RETRY_JITTER_MS = 250;

type SitemapIndex = 0 | 1 | 2 | 3;

const SITEMAP_INDEXES: SitemapIndex[] = [0, 1, 2, 3];
const RESERVED_RECIPE_SEGMENTS = new Set(["new", "my-fridge", "admin", "category", "private", "sitemap", "dyn"]);

export type AuditMode = "init" | "run" | "summary";
export type AuditClock = { now: () => Date; sleep: (ms: number) => Promise<void>; random: () => number };
export type AuditOutput = { stdout: (message: string) => void; stderr: (message: string) => void };
export type SitemapGateway = { fetchXml: (sitemapIndex: number) => Promise<string> };
export type GscGateway = {
  authenticate: () => Promise<string>;
  verifyProperty: (token: string) => Promise<{ status: number; hasProperty: boolean; error?: string }>;
  inspect: (token: string, url: string) => Promise<InspectOutcome>;
};
export type AuditDependencies = {
  dataDir: string;
  clock: AuditClock;
  output: AuditOutput;
  sitemap: SitemapGateway;
  gsc: GscGateway;
  createId: () => string;
};

const parseSitemapUrls = (xml: string): string[] =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());

const validateRecipeUrl = (rawUrl: string) => {
  const url = new URL(rawUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  if (
    url.origin !== "https://www.recipio.kr" ||
    segments.length !== 2 ||
    segments[0] !== "recipes" ||
    RESERVED_RECIPE_SEGMENTS.has(segments[1])
  ) {
    throw new Error(`Invalid recipe URL: ${rawUrl}`);
  }
};

type FetchedSitemap = Inventory["sources"][number] & { rows: string[] };

const fetchSitemap = async (
  sitemapIndex: SitemapIndex,
  dependencies: AuditDependencies
): Promise<FetchedSitemap> => {
  const url = `https://www.recipio.kr/recipes/sitemap/${sitemapIndex}.xml`;
  const rows = parseSitemapUrls(await dependencies.sitemap.fetchXml(sitemapIndex));
  if (rows.length === 0) throw new Error(`Empty sitemap: ${url}`);
  rows.forEach(validateRecipeUrl);
  return { sitemapIndex, url, rowCount: rows.length, rows };
};

const buildInventory = (
  fetchedSitemaps: FetchedSitemap[],
  dependencies: AuditDependencies
): Inventory => {
  const urls = new Map<string, Inventory["urls"][number]>();
  for (const sitemap of fetchedSitemaps) {
    for (const url of sitemap.rows) {
      const previous = urls.get(url);
      if (previous) previous.sitemapIndexes.push(sitemap.sitemapIndex);
      else urls.set(url, { url, sitemapIndexes: [sitemap.sitemapIndex] });
    }
  }
  const totalRows = fetchedSitemaps.reduce((sum, sitemap) => sum + sitemap.rowCount, 0);
  return {
    auditId: dependencies.createId(),
    createdAt: dependencies.clock.now().toISOString(),
    property: AUDIT_PROPERTY,
    sources: fetchedSitemaps.map(({ rows, ...source }) => source),
    duplicateRows: totalRows - urls.size,
    urls: [...urls.values()],
  };
};

const fetchInventory = async (dependencies: AuditDependencies): Promise<Inventory> => {
  const fetched = await Promise.all(
    SITEMAP_INDEXES.map((sitemapIndex) => fetchSitemap(sitemapIndex, dependencies))
  );
  return buildInventory(fetched, dependencies);
};

const initializeAudit = async (dependencies: AuditDependencies) => {
  const paths = getAuditPaths(dependencies.dataDir);
  if (fs.existsSync(paths.inventory)) throw new Error(`Inventory already exists: ${paths.inventory}`);
  const inventory = await fetchInventory(dependencies);
  saveInventory(paths.inventory, inventory);
  dependencies.output.stdout(
    `rows=${inventory.urls.length + inventory.duplicateRows} duplicates=${inventory.duplicateRows} unique=${inventory.urls.length}`
  );
};
```

- [ ] **Step 6: event append·parse와 최초 summary 생성을 구현한다.**

`scripts/lib/gsc-index-audit-store.ts`에 다음 함수를 추가한다.

```ts
export const appendEvent = (filePath: string, event: AuditEvent) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(AuditEventSchema.parse(event))}\n`, "utf8");
};

export const readEvents = (filePath: string): AuditEvent[] => {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .flatMap((line, index) => {
      if (line.trim() === "") return [];
      try {
        const parsed: unknown = JSON.parse(line);
        return [AuditEventSchema.parse(parsed)];
      } catch {
        throw new Error(`Invalid events.jsonl line ${index + 1}`);
      }
    });
};

const getLatestSuccessfulResults = (events: AuditEvent[]) => {
  const latest = new Map<string, Extract<AuditEvent, { type: "result" }>>();
  for (const event of events) {
    if (event.type === "result" && event.outcome === "success") latest.set(event.url, event);
  }
  return latest;
};

const getCoverageStateCounts = (
  results: Array<Extract<AuditEvent, { type: "result" }>>
) => {
  const counts: Record<string, number> = {};
  for (const result of results) {
    if (result.verdict === "PASS") continue;
    const key = result.coverageState ?? "(coverageState 없음)";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const getSuccessfulInventoryResults = (inventory: Inventory, events: AuditEvent[]) => {
  const latest = getLatestSuccessfulResults(events);
  return inventory.urls.flatMap(({ url }) => {
    const result = latest.get(url);
    return result ? [result] : [];
  });
};

export const buildSummary = (inventory: Inventory, events: AuditEvent[], now: Date): Summary => {
  const results = getSuccessfulInventoryResults(inventory, events);
  const indexed = results.filter((result) => result.verdict === "PASS").length;
  const checkedAt = results.map((result) => result.completedAt).sort();
  return SummarySchema.parse({
    auditId: inventory.auditId,
    generatedAt: now.toISOString(),
    total: inventory.urls.length,
    completed: results.length,
    pending: inventory.urls.length - results.length,
    indexed,
    coverageStateCounts: getCoverageStateCounts(results),
    apiFailureCounts: {},
    firstCheckedAt: checkedAt[0] ?? null,
    lastCheckedAt: checkedAt.at(-1) ?? null,
    recentAttempts: 0,
    nextAvailableAt: null,
  });
};

export const saveSummary = (filePath: string, summary: Summary) => writeJsonAtomic(filePath, summary);
```

- [ ] **Step 7: 첫 조사와 summary-only 명령을 구현한다.**

`scripts/lib/gsc-index-audit.ts`에 다음 초기 명령 흐름을 추가한다.

```ts
import {
  appendEvent,
  buildSummary,
  loadInventory,
  readEvents,
  saveSummary,
  type AuditEvent,
} from "./gsc-index-audit-store";

type ResultEvent = Extract<AuditEvent, { type: "result" }>;

const createSuccessResult = (
  inventory: Inventory,
  attemptId: string,
  url: string,
  completedAt: string,
  outcome: InspectOutcome
): ResultEvent => ({
  type: "result",
  attemptId,
  auditId: inventory.auditId,
  url,
  completedAt,
  httpStatus: 200,
  outcome: "success",
  verdict: outcome.verdict,
  coverageState: outcome.coverageState,
  indexingState: outcome.indexingState,
  robotsTxtState: outcome.robotsTxtState,
  pageFetchState: outcome.pageFetchState,
  lastCrawlTime: outcome.lastCrawlTime,
  googleCanonical: outcome.googleCanonical,
  userCanonical: outcome.userCanonical,
  crawledAs: outcome.crawledAs,
});

const regenerateSummary = (dependencies: AuditDependencies) => {
  const paths = getAuditPaths(dependencies.dataDir);
  const inventory = loadInventory(paths.inventory);
  const events = readEvents(paths.events);
  const summary = buildSummary(inventory, events, dependencies.clock.now());
  saveSummary(paths.summary, summary);
  dependencies.output.stdout(
    `total=${summary.total} completed=${summary.completed} pending=${summary.pending} indexed=${summary.indexed}`
  );
};

const loadAudit = (dependencies: AuditDependencies) => {
  const paths = getAuditPaths(dependencies.dataDir);
  const inventory = loadInventory(paths.inventory);
  const events = readEvents(paths.events);
  return { events, inventory, paths };
};

const authenticateGsc = async (dependencies: AuditDependencies) => {
  const token = await dependencies.gsc.authenticate();
  const property = await dependencies.gsc.verifyProperty(token);
  if (property.status !== 200 || !property.hasProperty) {
    throw new Error("GSC property access denied");
  }
  return token;
};

const inspectPending = async (
  dependencies: AuditDependencies,
  inventory: Inventory,
  eventsPath: string,
  url: string,
  token: string
) => {
  const attemptId = dependencies.createId();
  appendEvent(eventsPath, {
    type: "attempt",
    attemptId,
    auditId: inventory.auditId,
    url,
    attemptedAt: dependencies.clock.now().toISOString(),
  });
  const outcome = await dependencies.gsc.inspect(token, url);
  if (outcome.status !== 200) throw new Error(`Inspection failed: ${outcome.status}`);
  appendEvent(
    eventsPath,
    createSuccessResult(inventory, attemptId, url, dependencies.clock.now().toISOString(), outcome)
  );
};

const inspectFirstPendingUrl = async (dependencies: AuditDependencies) => {
  const { events, inventory, paths } = loadAudit(dependencies);
  const completedUrls = new Set(
    events.flatMap((event) =>
      event.type === "result" && event.outcome === "success" ? [event.url] : []
    )
  );
  const pending = inventory.urls.find(({ url }) => !completedUrls.has(url));
  if (!pending) return regenerateSummary(dependencies);
  const token = await authenticateGsc(dependencies);
  await inspectPending(dependencies, inventory, paths.events, pending.url, token);
  regenerateSummary(dependencies);
};

export const runAuditCommand = async (args: string[], dependencies: AuditDependencies): Promise<number> => {
  try {
    if (args.length !== 1) throw new Error("Usage: --init | --run | --summary");
    if (args[0] === "--init") await initializeAudit(dependencies);
    else if (args[0] === "--run") await inspectFirstPendingUrl(dependencies);
    else if (args[0] === "--summary") regenerateSummary(dependencies);
    else throw new Error("Usage: --init | --run | --summary");
    return 0;
  } catch (error) {
    dependencies.output.stderr(error instanceof Error ? error.message : String(error));
    return 1;
  }
};
```

- [ ] **Step 8: T-03과 T-04를 작성한다.**

```ts
it("T-03: 첫 PASS는 시도와 성공 결과를 남기고 색인됨 1로 집계한다", async () => {
  const harness = createHarness();
  await runAuditCommand(["--init"], harness.dependencies);

  expect(await runAuditCommand(["--run"], harness.dependencies)).toBe(0);

  const paths = getAuditPaths(harness.dataDir);
  const events = readEvents(paths.events);
  const summary = SummarySchema.parse(JSON.parse(fs.readFileSync(paths.summary, "utf8")));
  expect(events.map((event) => event.type)).toEqual(["attempt", "result"]);
  expect(events[0].attemptId).toBe(events[1].attemptId);
  expect(summary).toMatchObject({ total: 4, completed: 1, pending: 3, indexed: 1 });
});

it("T-04: summary-only는 저장 데이터만으로 같은 집계를 재생성한다", async () => {
  const harness = createHarness();
  await runAuditCommand(["--init"], harness.dependencies);
  await runAuditCommand(["--run"], harness.dependencies);
  const paths = getAuditPaths(harness.dataDir);
  const before = SummarySchema.parse(JSON.parse(fs.readFileSync(paths.summary, "utf8")));
  harness.inspectionUrls.length = 0;
  harness.sitemapCalls.length = 0;
  fs.rmSync(paths.summary);

  expect(await runAuditCommand(["--summary"], harness.dependencies)).toBe(0);

  const after = SummarySchema.parse(JSON.parse(fs.readFileSync(paths.summary, "utf8")));
  expect(harness.inspectionUrls).toEqual([]);
  expect(harness.sitemapCalls).toEqual([]);
  expect(after).toMatchObject({ total: before.total, completed: before.completed, indexed: before.indexed });
});
```

- [ ] **Step 9: walking skeleton 테스트를 실행한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-01|T-03|T-04" --runInBand
```

Expected: PASS, 3 tests.

- [ ] **Step 10: 관련 파일만 커밋한다.**

```powershell
git add -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
git diff --cached --check
git commit -m "feat(seo): add GSC audit walking skeleton" -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
```

### Task 2: 명령 경계와 초기화 불변성을 고정한다

**Tests:** T-20, T-02

**Files:**

- Modify: `scripts/lib/gsc-index-audit.ts`
- Modify: `scripts/__tests__/gsc-recipe-index-audit.test.ts`

- [ ] **Step 1: T-20과 T-02 failing test를 작성한다.**

```ts
it.each([[], ["--init", "--run"]])(
  "T-20: 동작을 정확히 하나 지정하지 않으면 외부 호출과 파일 변경이 없다",
  async (args) => {
    const harness = createHarness();
    const sentinel = "sentinel\n";
    const paths = getAuditPaths(harness.dataDir);
    fs.writeFileSync(paths.events, sentinel, "utf8");

    expect(await runAuditCommand(args, harness.dependencies)).toBe(1);
    expect(harness.sitemapCalls).toEqual([]);
    expect(harness.inspectionUrls).toEqual([]);
    expect(fs.readFileSync(paths.events, "utf8")).toBe(sentinel);
    expect(harness.stderr.join("\n")).toContain("Usage");
  }
);

it("T-02: 기존 조사 대상은 재초기화로 덮어쓰지 않는다", async () => {
  const harness = createHarness();
  await runAuditCommand(["--init"], harness.dependencies);
  const paths = getAuditPaths(harness.dataDir);
  const before = fs.readFileSync(paths.inventory);
  fs.writeFileSync(paths.events, "sentinel-events\n", "utf8");
  harness.sitemapCalls.length = 0;

  expect(await runAuditCommand(["--init"], harness.dependencies)).toBe(1);
  expect(harness.sitemapCalls).toEqual([]);
  expect(fs.readFileSync(paths.inventory)).toEqual(before);
  expect(fs.readFileSync(paths.events, "utf8")).toBe("sentinel-events\n");
});
```

- [ ] **Step 2: 테스트가 잘못된 복수 mode와 기존 inventory에서 실패하는지 확인한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-20|T-02" --runInBand
```

Expected: FAIL until mode parsing occurs before every file/network action and inventory existence is checked before sitemap fetch.

- [ ] **Step 3: mode 파싱을 별도 함수로 고정한다.**

```ts
const MODE_BY_FLAG: Record<string, AuditMode> = {
  "--init": "init",
  "--run": "run",
  "--summary": "summary",
};

const parseMode = (args: string[]): AuditMode => {
  const modes = args.flatMap((arg) => {
    const mode = MODE_BY_FLAG[arg];
    return mode ? [mode] : [];
  });
  if (args.length !== 1 || modes.length !== 1) throw new Error("Usage: --init | --run | --summary");
  return modes[0];
};
```

`runAuditCommand`는 `const mode = parseMode(args)`를 첫 문장으로 실행하고 `mode`에 따라 분기한다. `initializeAudit`은 현재처럼 inventory 존재 여부를 sitemap fetch보다 먼저 확인한다.

- [ ] **Step 4: T-20과 T-02를 다시 실행한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-20|T-02" --runInBand
```

Expected: PASS, 2 tests.

- [ ] **Step 5: 관련 파일만 커밋한다.**

```powershell
git add -- scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
git diff --cached --check
git commit -m "feat(seo): guard GSC audit command modes" -- scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
```

### Task 3: 중단된 조사를 중복 호출 없이 재개한다

**Tests:** T-06, T-07, T-08, T-05, T-09

**Files:**

- Modify: `scripts/lib/gsc-index-audit-store.ts`
- Modify: `scripts/lib/gsc-index-audit.ts`
- Modify: `scripts/__tests__/gsc-recipe-index-audit.test.ts`

- [ ] **Step 1: T-06·T-07·T-08 재개 failing tests를 작성한다.**

```ts
const createRunFixture = (ids: string[]) => {
  const harness = createHarness();
  const inventory = InventorySchema.parse({
    auditId: "audit-fixture",
    createdAt: NOW.toISOString(),
    property: "sc-domain:recipio.kr",
    sources: [0, 1, 2, 3].map((sitemapIndex) => ({
      sitemapIndex,
      url: `https://www.recipio.kr/recipes/sitemap/${sitemapIndex}.xml`,
      rowCount: sitemapIndex === 0 ? ids.length : 0,
    })),
    duplicateRows: 0,
    urls: ids.map((id) => ({
      url: `https://www.recipio.kr/recipes/${id}`,
      sitemapIndexes: [0],
    })),
  });
  saveInventory(getAuditPaths(harness.dataDir).inventory, inventory);
  return { ...harness, inventory };
};

const createSummaryFixture = createRunFixture;

const loadSummary = (dataDir: string) => {
  const paths = getAuditPaths(dataDir);
  return SummarySchema.parse(JSON.parse(fs.readFileSync(paths.summary, "utf8")));
};

const appendSuccessfulResult = (
  fixture: ReturnType<typeof createRunFixture>,
  id: string,
  verdict: string,
  coverageState: string | undefined,
  completedAt: string
) => {
  appendEvent(getAuditPaths(fixture.dataDir).events, {
    type: "result",
    attemptId: `result-${id}-${completedAt}`,
    auditId: fixture.inventory.auditId,
    url: `https://www.recipio.kr/recipes/${id}`,
    completedAt,
    httpStatus: 200,
    outcome: "success",
    verdict,
    coverageState,
  });
};

const appendRequestError = (
  fixture: ReturnType<typeof createRunFixture>,
  id: string,
  status: number
) => {
  appendEvent(getAuditPaths(fixture.dataDir).events, {
    type: "result",
    attemptId: `error-${id}`,
    auditId: fixture.inventory.auditId,
    url: `https://www.recipio.kr/recipes/${id}`,
    completedAt: NOW.toISOString(),
    httpStatus: status,
    outcome: "request_error",
    error: "request failed",
  });
};

it("T-06: 완료 URL을 건너뛰고 첫 미완료 URL만 검사한다", async () => {
  const harness = createRunFixture(["A", "B"]);
  appendSuccessfulResult(
    harness,
    "A",
    "PASS",
    "URL is on Google",
    "2026-08-14T11:00:00.000Z"
  );

  await runAuditCommand(["--run"], harness.dependencies);

  expect(harness.inspectionUrls).toEqual(["https://www.recipio.kr/recipes/B"]);
});

it("T-07: 결과 없는 시도는 사용량에 남고 URL은 다시 검사한다", async () => {
  const harness = createRunFixture(["A"]);
  const paths = getAuditPaths(harness.dataDir);
  appendEvent(paths.events, {
    type: "attempt",
    attemptId: "orphan",
    auditId: harness.inventory.auditId,
    url: harness.inventory.urls[0].url,
    attemptedAt: "2026-08-14T11:00:00.000Z",
  });

  await runAuditCommand(["--run"], harness.dependencies);

  const summary = SummarySchema.parse(JSON.parse(fs.readFileSync(paths.summary, "utf8")));
  expect(harness.inspectionUrls[0]).toBe(harness.inventory.urls[0].url);
  expect(summary.recentAttempts).toBe(2);
});

it("T-08: 재개는 sitemap을 다시 읽지 않고 고정 조사 대상을 사용한다", async () => {
  const harness = createHarness();
  await runAuditCommand(["--init"], harness.dependencies);
  const paths = getAuditPaths(harness.dataDir);
  const inventory = InventorySchema.parse(JSON.parse(fs.readFileSync(paths.inventory, "utf8")));
  harness.sitemapCalls.length = 0;
  harness.dependencies.sitemap.fetchXml = async () => sitemapXml("https://www.recipio.kr/recipes/Z");

  await runAuditCommand(["--run"], harness.dependencies);

  expect(harness.sitemapCalls).toEqual([]);
  expect(harness.inspectionUrls[0]).toBe(inventory.urls[0].url);
});
```

- [ ] **Step 2: T-05·T-09 상태 집계 failing tests를 작성한다.**

테스트 helper로 성공 결과를 직접 append하는 `appendSuccessfulResult`를 추가하고 다음 assertions를 작성한다.

```ts
it("T-05: URL별 최신 성공 결과 하나만 상태 집계에 사용한다", async () => {
  const fixture = createSummaryFixture(["A", "B", "C", "D"]);
  appendSuccessfulResult(fixture, "A", "PASS", "URL is on Google", "2026-08-14T08:00:00.000Z");
  appendSuccessfulResult(fixture, "B", "NEUTRAL", "Discovered - currently not indexed", "2026-08-14T09:00:00.000Z");
  appendSuccessfulResult(fixture, "B", "NEUTRAL", "Crawled - currently not indexed", "2026-08-14T10:00:00.000Z");
  appendSuccessfulResult(fixture, "C", "NEUTRAL", undefined, "2026-08-14T11:00:00.000Z");
  appendRequestError(fixture, "D", 400);

  await runAuditCommand(["--summary"], fixture.dependencies);

  const summary = loadSummary(fixture.dataDir);
  expect(summary).toMatchObject({ completed: 3, pending: 1, indexed: 1 });
  expect(summary.coverageStateCounts).toEqual({
    "Crawled - currently not indexed": 1,
    "(coverageState 없음)": 1,
  });
  expect(summary.apiFailureCounts).toEqual({ request_error: 1 });
  expect(fixture.stdout.join("\n")).toContain("Crawled - currently not indexed");
});

it("T-09: 모든 조사 대상이 완료되면 전체·완료·상태 합계가 같다", async () => {
  const fixture = createSummaryFixture(["A", "B", "C"]);
  appendSuccessfulResult(fixture, "A", "PASS", "URL is on Google", "2026-08-14T08:00:00.000Z");
  appendSuccessfulResult(fixture, "B", "NEUTRAL", "Discovered - currently not indexed", "2026-08-14T09:00:00.000Z");
  appendSuccessfulResult(fixture, "C", "NEUTRAL", "Crawled - currently not indexed", "2026-08-14T10:00:00.000Z");

  await runAuditCommand(["--summary"], fixture.dependencies);

  const summary = loadSummary(fixture.dataDir);
  const statusTotal = summary.indexed + Object.values(summary.coverageStateCounts).reduce((sum, count) => sum + count, 0);
  expect(summary).toMatchObject({ total: 3, completed: 3, pending: 0 });
  expect(statusTotal).toBe(3);
});
```

- [ ] **Step 3: 재개 테스트가 현재 한 URL만 처리하거나 최근 시도를 세지 못해 실패하는지 확인한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-05|T-06|T-07|T-08|T-09" --runInBand
```

Expected: FAIL on latest-result folding, recent attempt count, or all-pending iteration.

- [ ] **Step 4: store에 완료 URL·최신 실패·최근 시도 fold를 구현한다.**

```ts
const DAY_MS = 24 * 60 * 60 * 1000;

export const getCompletedUrls = (events: AuditEvent[]) =>
  new Set(
    events.flatMap((event) =>
      event.type === "result" && event.outcome === "success" ? [event.url] : []
    )
  );

export const getRecentAttempts = (events: AuditEvent[], now: Date) => {
  const cutoff = now.getTime() - DAY_MS;
  return events.filter(
    (event) => event.type === "attempt" && new Date(event.attemptedAt).getTime() > cutoff
  );
};

const getLatestFailuresForPendingUrls = (
  inventory: Inventory,
  events: AuditEvent[],
  completedUrls: Set<string>
) => {
  const inventoryUrls = new Set(inventory.urls.map(({ url }) => url));
  const latest = new Map<string, Extract<AuditEvent, { type: "result" }>>();
  for (const event of events) {
    if (
      event.type === "result" &&
      event.outcome !== "success" &&
      inventoryUrls.has(event.url) &&
      !completedUrls.has(event.url)
    ) {
      latest.set(event.url, event);
    }
  }
  return [...latest.values()];
};

const countFailureOutcomes = (
  failures: Array<Extract<AuditEvent, { type: "result" }>>
) => {
  const counts: Record<string, number> = {};
  for (const failure of failures) {
    counts[failure.outcome] = (counts[failure.outcome] ?? 0) + 1;
  }
  return counts;
};
```

Task 1의 `buildSummary`를 다음 구현으로 교체한다. `apiFailureCounts`는 pending URL별 최신 실패 outcome만 세고, `recentAttempts`는 결과 유무와 관계없이 모든 최근 attempt를 센다.

```ts
export const buildSummary = (
  inventory: Inventory,
  events: AuditEvent[],
  now: Date
): Summary => {
  const results = getSuccessfulInventoryResults(inventory, events);
  const completedUrls = getCompletedUrls(events);
  const latestFailures = getLatestFailuresForPendingUrls(
    inventory,
    events,
    completedUrls
  );
  const indexed = results.filter((result) => result.verdict === "PASS").length;
  const checkedAt = results.map((result) => result.completedAt).sort();
  return SummarySchema.parse({
    auditId: inventory.auditId,
    generatedAt: now.toISOString(),
    total: inventory.urls.length,
    completed: results.length,
    pending: inventory.urls.length - results.length,
    indexed,
    coverageStateCounts: getCoverageStateCounts(results),
    apiFailureCounts: countFailureOutcomes(latestFailures),
    firstCheckedAt: checkedAt[0] ?? null,
    lastCheckedAt: checkedAt.at(-1) ?? null,
    recentAttempts: getRecentAttempts(events, now).length,
    nextAvailableAt: null,
  });
};
```

`Summary` type을 store import에 추가한다. `regenerateSummary`의 콘솔 출력은 진행률과 상태별 개수만 짧게 확인할 수 있도록 다음 formatter를 사용한다. GSC가 반환한 `coverageState` 문자열은 번역하거나 합치지 않고 그대로 key로 출력한다.

```ts
const formatSummary = (summary: Summary) =>
  [
    `total=${summary.total} completed=${summary.completed} pending=${summary.pending}`,
    `statusCounts=${JSON.stringify({ indexed: summary.indexed, ...summary.coverageStateCounts })}`,
    `apiFailureCounts=${JSON.stringify(summary.apiFailureCounts)}`,
    `recentAttempts=${summary.recentAttempts} nextAvailableAt=${summary.nextAvailableAt ?? "-"}`,
  ].join("\n");

dependencies.output.stdout(formatSummary(summary));
```

- [ ] **Step 5: `--run`을 inventory 전체 미완료 URL 순회로 바꾼다.**

```ts
const inspectPendingUrls = async (dependencies: AuditDependencies) => {
  const { events, inventory, paths } = loadAudit(dependencies);
  const completedUrls = getCompletedUrls(events);
  const pendingUrls = inventory.urls.filter(({ url }) => !completedUrls.has(url));
  if (pendingUrls.length === 0) return regenerateSummary(dependencies);

  const token = await authenticateGsc(dependencies);
  for (const pending of pendingUrls) {
    await inspectPending(dependencies, inventory, paths.events, pending.url, token);
  }
  regenerateSummary(dependencies);
};
```

`runAuditCommand`의 `run` 분기도 기존 `inspectFirstPendingUrl` 대신 `inspectPendingUrls`를 호출하도록 교체한다.

- [ ] **Step 6: 재개와 상태 집계 테스트를 다시 실행한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-05|T-06|T-07|T-08|T-09" --runInBand
```

Expected: PASS, 5 tests.

- [ ] **Step 7: 관련 파일만 커밋한다.**

```powershell
git add -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
git diff --cached --check
git commit -m "feat(seo): resume GSC audit without duplicate calls" -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
```

### Task 4: 호출 여유와 요청 간격 안에서 조사한다

**Tests:** T-12, T-10, T-11, T-13, T-14

**Files:**

- Modify: `scripts/lib/gsc-index-audit-store.ts`
- Modify: `scripts/lib/gsc-index-audit.ts`
- Modify: `scripts/__tests__/gsc-recipe-index-audit.test.ts`

- [ ] **Step 1: T-12·T-10·T-11 호출 경계 failing tests를 작성한다.**

```ts
const appendAttempts = (
  fixture: ReturnType<typeof createRunFixture>,
  count: number,
  attemptedAt: string
) => {
  const eventsPath = getAuditPaths(fixture.dataDir).events;
  for (let index = 0; index < count; index++) {
    appendEvent(eventsPath, {
      type: "attempt",
      attemptId: `attempt-${index}`,
      auditId: fixture.inventory.auditId,
      url: fixture.inventory.urls[0].url,
      attemptedAt,
    });
  }
};

it("T-12: 연속 Inspection 시작 사이에 최소 250ms를 둔다", async () => {
  const fixture = createRunFixture(["A", "B", "C"]);
  const starts: number[] = [];
  fixture.dependencies.gsc.inspect = async (_token, url) => {
    starts.push(fixture.elapsedMs());
    return { status: 200, verdict: "PASS", coverageState: url };
  };

  await runAuditCommand(["--run"], fixture.dependencies);

  expect(starts).toEqual([0, 250, 500]);
});

it("T-10: 최근 시도 1,800회면 새 Inspection 없이 다음 가능 시각을 보여준다", async () => {
  const fixture = createRunFixture(["A"]);
  appendAttempts(fixture, 1800, "2026-08-13T13:00:00.000Z");

  await runAuditCommand(["--run"], fixture.dependencies);

  expect(fixture.inspectionUrls).toEqual([]);
  expect(fixture.stdout.join("\n")).toContain("2026-08-14T13:00:00.000Z");
});

it("T-11: 최근 시도 1,799회면 정확히 한 번만 Inspection한다", async () => {
  const fixture = createRunFixture(["A", "B"]);
  appendAttempts(fixture, 1799, "2026-08-13T13:00:00.000Z");

  await runAuditCommand(["--run"], fixture.dependencies);

  expect(fixture.inspectionUrls).toEqual(["https://www.recipio.kr/recipes/A"]);
});
```

- [ ] **Step 2: T-13·T-14 재시도와 429 failing tests를 작성한다.**

```ts
it("T-13: network·500·500 뒤에는 네 번째 호출 없이 URL을 미완료로 둔다", async () => {
  const fixture = createRunFixture(["A"]);
  const outcomes = [new Error("network"), { status: 500, error: "server" }, { status: 500, error: "server" }];
  fixture.dependencies.gsc.inspect = async () => {
    const outcome = outcomes.shift();
    if (outcome instanceof Error) throw outcome;
    if (!outcome) throw new Error("unexpected fourth call");
    return outcome;
  };

  await runAuditCommand(["--run"], fixture.dependencies);

  expect(readEvents(getAuditPaths(fixture.dataDir).events).filter((event) => event.type === "attempt")).toHaveLength(3);
  expect(fixture.sleeps.filter((ms) => ms > MIN_REQUEST_INTERVAL_MS)).toEqual([1125, 2125]);
  expect(loadSummary(fixture.dataDir).pending).toBe(1);
});

it("T-14: 429는 현재 실행을 즉시 멈추고 다음 URL을 호출하지 않는다", async () => {
  const fixture = createRunFixture(["A", "B"]);
  fixture.dependencies.gsc.inspect = async (_token, url) => {
    fixture.inspectionUrls.push(url);
    return { status: 429, error: "quota" };
  };

  await runAuditCommand(["--run"], fixture.dependencies);

  expect(fixture.inspectionUrls).toEqual(["https://www.recipio.kr/recipes/A"]);
  expect(readEvents(getAuditPaths(fixture.dataDir).events)).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: "result", outcome: "rate_limited" })])
  );
});
```

- [ ] **Step 3: 호출 경계 테스트를 실행해 현재 순회가 한도를 넘거나 즉시 연속 호출하는지 확인한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-10|T-11|T-12|T-13|T-14" --runInBand
```

Expected: FAIL on missing allowance, spacing, retry, or stop policy.

- [ ] **Step 4: rolling 24시간 호출 여유와 다음 가능 시각을 구현한다.**

`scripts/lib/gsc-index-audit-store.ts`에 다음 계산을 추가한다.

```ts
export const getNextAvailableAt = (events: AuditEvent[], now: Date, limit: number) => {
  const recent = getRecentAttempts(events, now);
  if (recent.length < limit) return null;
  const starts = recent
    .map((event) => new Date(event.attemptedAt).getTime())
    .sort((left, right) => left - right);
  return new Date(starts[recent.length - limit] + DAY_MS).toISOString();
};

export const getRateWindow = (events: AuditEvent[], now: Date, limit: number) => ({
  recentAttempts: getRecentAttempts(events, now).length,
  nextAvailableAt: getNextAvailableAt(events, now, limit),
});
```

`regenerateSummary`는 기본 상태 집계에 rate window를 합친 뒤 저장한다.

```ts
const statusSummary = buildSummary(inventory, events, dependencies.clock.now());
const summary = SummarySchema.parse({
  ...statusSummary,
  ...getRateWindow(events, dependencies.clock.now(), MAX_ATTEMPTS_24H),
});
saveSummary(paths.summary, summary);
dependencies.output.stdout(formatSummary(summary));
```

- [ ] **Step 5: 순차 요청 간격과 시도 전 allowance 검사를 구현한다.**

`scripts/lib/gsc-index-audit.ts`에서 요청 간격 상태는 run마다 새 객체로 만든다.

```ts
type RequestPacer = { lastStartedAt: number | null };

const waitForRequestSlot = async (clock: AuditClock, pacer: RequestPacer) => {
  if (pacer.lastStartedAt === null) return;
  const elapsed = clock.now().getTime() - pacer.lastStartedAt;
  const waitMs = Math.max(0, MIN_REQUEST_INTERVAL_MS - elapsed);
  if (waitMs > 0) await clock.sleep(waitMs);
};

const hasAllowance = (events: AuditEvent[], clock: AuditClock) =>
  getRecentAttempts(events, clock.now()).length < MAX_ATTEMPTS_24H;
```

매 API 호출 직전 순서는 `hasAllowance` → `waitForRequestSlot` → attempt append → `pacer.lastStartedAt` 갱신 → Inspection이다. 새 attempt를 memory의 `events`에도 push해 같은 실행 안에서 1,800 경계가 즉시 반영되게 한다.

`hasAllowance`가 false면 새 시도를 만들지 않고 현재 events로 summary를 저장한다. `nextAvailableAt`이 있으면 stdout에 ISO 시각을 출력한 뒤 현재 run을 정상 종료한다.

- [ ] **Step 6: status별 결과와 최대 두 번 재시도를 구현한다.**

```ts
type AttemptDecision = "continue_url" | "next_url" | "stop_run";

const getFailureOutcome = (status: number | null) => {
  if (status === 429) return "rate_limited";
  if (status === 401 || status === 403) return "auth_error";
  if (status !== null && status >= 400 && status < 500) return "request_error";
  return "retryable_error";
};

const getAttemptDecision = (
  status: number | null,
  retryIndex: number
): AttemptDecision => {
  if (status === 429 || status === 401 || status === 403) return "stop_run";
  if (status !== null && status >= 400 && status < 500) return "next_url";
  return retryIndex < RETRY_BASE_MS.length ? "continue_url" : "next_url";
};

const getRetryDelay = (retryIndex: number, clock: AuditClock) =>
  RETRY_BASE_MS[retryIndex] + Math.floor(clock.random() * RETRY_JITTER_MS);

const createFailureResult = (
  inventory: Inventory,
  attemptId: string,
  url: string,
  status: number | null,
  error: string,
  token: string,
  completedAt: string
): ResultEvent => ({
  type: "result",
  attemptId,
  auditId: inventory.auditId,
  url,
  completedAt,
  httpStatus: status,
  outcome: getFailureOutcome(status),
  error: token ? error.split(token).join("[REDACTED]").slice(0, 300) : error.slice(0, 300),
});

type PendingUrlResult = "next_url" | "stop_run" | "allowance_exhausted";

type AttemptContext = {
  dependencies: AuditDependencies;
  events: AuditEvent[];
  eventsPath: string;
  inventory: Inventory;
  pacer: RequestPacer;
  token: string;
  url: string;
};

const appendTrackedEvent = (
  eventsPath: string,
  events: AuditEvent[],
  event: AuditEvent
) => {
  appendEvent(eventsPath, event);
  events.push(event);
};

const startAttempt = async (context: AttemptContext) => {
  if (!hasAllowance(context.events, context.dependencies.clock)) return null;
  await waitForRequestSlot(context.dependencies.clock, context.pacer);
  const attemptId = context.dependencies.createId();
  const attemptedAt = context.dependencies.clock.now().toISOString();
  appendTrackedEvent(context.eventsPath, context.events, {
    type: "attempt",
    attemptId,
    auditId: context.inventory.auditId,
    url: context.url,
    attemptedAt,
  });
  context.pacer.lastStartedAt = new Date(attemptedAt).getTime();
  return attemptId;
};

const requestInspection = async (context: AttemptContext) => {
  try {
    const outcome = await context.dependencies.gsc.inspect(
      context.token,
      context.url
    );
    return { outcome, error: outcome.error ?? "" };
  } catch (error) {
    return {
      outcome: { status: 0 },
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const createInspectionResult = (
  context: AttemptContext,
  attemptId: string,
  outcome: InspectOutcome,
  error: string
): ResultEvent => {
  const status = outcome.status === 0 ? null : outcome.status;
  const completedAt = context.dependencies.clock.now().toISOString();
  return outcome.status === 200
    ? createSuccessResult(context.inventory, attemptId, context.url, completedAt, outcome)
    : createFailureResult(
        context.inventory,
        attemptId,
        context.url,
        status,
        error,
        context.token,
        completedAt
      );
};

const recordInspectionResult = (
  context: AttemptContext,
  attemptId: string,
  outcome: InspectOutcome,
  error: string
) => {
  const result = createInspectionResult(context, attemptId, outcome, error);
  appendTrackedEvent(context.eventsPath, context.events, result);
  return result.httpStatus;
};

const executeAttempt = async (
  context: AttemptContext,
  retryIndex: number
): Promise<AttemptDecision | "allowance_exhausted"> => {
  const attemptId = await startAttempt(context);
  if (!attemptId) return "allowance_exhausted";
  const { outcome, error } = await requestInspection(context);
  const status = recordInspectionResult(context, attemptId, outcome, error);
  return status === 200 ? "next_url" : getAttemptDecision(status, retryIndex);
};

const inspectPendingUrl = async (context: AttemptContext): Promise<PendingUrlResult> => {
  for (let retryIndex = 0; retryIndex <= RETRY_BASE_MS.length; retryIndex++) {
    const decision = await executeAttempt(context, retryIndex);
    if (decision !== "continue_url") return decision;
    await context.dependencies.clock.sleep(getRetryDelay(retryIndex, context.dependencies.clock));
  }
  return "next_url";
};
```

Inspection throw는 `status: null`, 5xx는 실제 status로 `retryable_error` 결과를 각각 기록한다. `continue_url`이면 backoff 뒤 같은 URL을 재시도하고, `next_url`이면 미완료로 둔 채 다음 URL로 이동하며, `stop_run`이면 summary를 저장한 뒤 반복을 끝낸다.

Task 3의 `inspectPendingUrls`는 다음 최종 순회로 교체한다. 파일 검증과 완료 URL 계산은 인증보다 먼저 하고, 호출 여유가 없으면 인증·property 확인·Inspection 없이 summary만 갱신한다.

```ts
const inspectPendingUrls = async (dependencies: AuditDependencies) => {
  const { events, inventory, paths } = loadAudit(dependencies);
  const completedUrls = getCompletedUrls(events);
  const pendingUrls = inventory.urls.filter(({ url }) => !completedUrls.has(url));
  if (pendingUrls.length === 0 || !hasAllowance(events, dependencies.clock)) {
    return regenerateSummary(dependencies);
  }

  const token = await authenticateGsc(dependencies);
  const pacer: RequestPacer = { lastStartedAt: null };
  for (const pending of pendingUrls) {
    const result = await inspectPendingUrl({
      dependencies,
      events,
      eventsPath: paths.events,
      inventory,
      pacer,
      token,
      url: pending.url,
    });
    if (result !== "next_url") break;
  }
  regenerateSummary(dependencies);
};
```

- [ ] **Step 7: 호출 경계 테스트를 다시 실행한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-10|T-11|T-12|T-13|T-14" --runInBand
```

Expected: PASS, 5 tests.

- [ ] **Step 8: 관련 파일만 커밋한다.**

```powershell
git add -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
git diff --cached --check
git commit -m "feat(seo): enforce GSC inspection quotas" -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
```

### Task 5: 인증·입력·저장 오류에서 기존 조사를 보존한다

**Tests:** T-15, T-16, T-17, T-18, T-19

**Files:**

- Modify: `scripts/lib/gsc-index-audit-store.ts`
- Modify: `scripts/lib/gsc-index-audit.ts`
- Modify: `scripts/__tests__/gsc-recipe-index-audit.test.ts`

- [ ] **Step 1: T-15·T-16 HTTP 오류 failing tests를 작성한다.**

```ts
const snapshotFiles = (paths: ReturnType<typeof getAuditPaths>) => ({
  inventory: fs.existsSync(paths.inventory) ? fs.readFileSync(paths.inventory).toString("base64") : null,
  events: fs.existsSync(paths.events) ? fs.readFileSync(paths.events).toString("base64") : null,
  summary: fs.existsSync(paths.summary) ? fs.readFileSync(paths.summary).toString("base64") : null,
});

const writeSentinelSummary = (summaryPath: string) => {
  fs.writeFileSync(summaryPath, "sentinel-summary\n", "utf8");
};

it("T-15: property 403은 Inspection과 기존 파일 변경 없이 종료한다", async () => {
  const fixture = createRunFixture(["A"]);
  const paths = getAuditPaths(fixture.dataDir);
  writeSentinelSummary(paths.summary);
  const before = snapshotFiles(paths);
  fixture.dependencies.gsc.verifyProperty = async () => ({ status: 403, hasProperty: false, error: "denied" });

  expect(await runAuditCommand(["--run"], fixture.dependencies)).toBe(1);
  expect(fixture.inspectionUrls).toEqual([]);
  expect(snapshotFiles(paths)).toEqual(before);
});

it("T-16: 400 URL은 미완료로 남기고 다음 URL은 계속 검사한다", async () => {
  const fixture = createRunFixture(["A", "B"]);
  fixture.dependencies.gsc.inspect = async (_token, url) => {
    fixture.inspectionUrls.push(url);
    return url.endsWith("/A")
      ? { status: 400, error: "bad request" }
      : { status: 200, verdict: "PASS", coverageState: "URL is on Google" };
  };

  await runAuditCommand(["--run"], fixture.dependencies);

  expect(fixture.inspectionUrls).toEqual([
    "https://www.recipio.kr/recipes/A",
    "https://www.recipio.kr/recipes/B",
  ]);
  expect(loadSummary(fixture.dataDir)).toMatchObject({ completed: 1, pending: 1 });
});
```

- [ ] **Step 2: T-17·T-18 데이터 오류 failing tests를 작성한다.**

```ts
it.each([
  { index: 2, xml: sitemapXml(), label: "empty" },
  { index: 1, xml: sitemapXml("https://evil.example/recipes/X"), label: "origin" },
  { index: 3, xml: sitemapXml("https://www.recipio.kr/recipes/admin"), label: "reserved" },
])("T-17: $label sitemap은 기존 데이터를 보존하고 초기화에 실패한다", async ({ index, xml }) => {
  const harness = createHarness();
  const paths = getAuditPaths(harness.dataDir);
  fs.writeFileSync(paths.events, "sentinel-events\n", "utf8");
  fs.writeFileSync(paths.summary, "sentinel-summary\n", "utf8");
  harness.dependencies.sitemap.fetchXml = async (sitemapIndex) =>
    sitemapIndex === index ? xml : sitemapXml(`https://www.recipio.kr/recipes/${sitemapIndex}`);

  expect(await runAuditCommand(["--init"], harness.dependencies)).toBe(1);
  expect(fs.existsSync(paths.inventory)).toBe(false);
  expect(fs.readFileSync(paths.events, "utf8")).toBe("sentinel-events\n");
  expect(fs.readFileSync(paths.summary, "utf8")).toBe("sentinel-summary\n");
  expect(harness.inspectionUrls).toEqual([]);
});

it("T-18: 깨진 events 3행은 파일을 바꾸거나 GSC를 호출하기 전에 실패한다", async () => {
  const fixture = createRunFixture(["A"]);
  const paths = getAuditPaths(fixture.dataDir);
  appendAttempts(fixture, 2, "2026-08-14T11:00:00.000Z");
  fs.appendFileSync(paths.events, "{broken\n", "utf8");
  const before = fs.readFileSync(paths.events);

  expect(await runAuditCommand(["--run"], fixture.dependencies)).toBe(1);
  expect(fixture.stderr.join("\n")).toContain("events.jsonl line 3");
  expect(fs.readFileSync(paths.events)).toEqual(before);
  expect(fixture.inspectionUrls).toEqual([]);
});
```

- [ ] **Step 3: T-19 secret 차단 failing test를 작성한다.**

```ts
it("T-19: credential·token·Authorization은 파일과 콘솔 어디에도 남지 않는다", async () => {
  const fixture = createRunFixture(["A"]);
  fixture.dependencies.gsc.authenticate = async () => "token-super-secret";
  fixture.dependencies.gsc.inspect = async () => {
    throw new Error(
      "credential-super-secret Authorization: Bearer token-super-secret"
    );
  };

  await runAuditCommand(["--run"], fixture.dependencies);

  const paths = getAuditPaths(fixture.dataDir);
  const output = [
    fs.readFileSync(paths.inventory, "utf8"),
    fs.readFileSync(paths.events, "utf8"),
    fs.readFileSync(paths.summary, "utf8"),
    fixture.stdout.join("\n"),
    fixture.stderr.join("\n"),
  ].join("\n");
  expect(output).not.toContain("credential-super-secret");
  expect(output).not.toContain("token-super-secret");
  expect(output).not.toMatch(/Authorization:\s*Bearer/i);
});
```

- [ ] **Step 4: 오류 보존 테스트가 현재 raw 오류·부분 쓰기 때문에 실패하는지 확인한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-15|T-16|T-17|T-18|T-19" --runInBand
```

Expected: FAIL on permission preflight preservation, raw secret output, or input validation.

- [ ] **Step 5: 민감정보 제거와 오류 메시지 길이 제한을 구현한다.**

```ts
const MAX_ERROR_LENGTH = 300;

const redactSensitive = (message: string, secrets: string[] = []) => {
  const withoutHeader = message.replace(/Authorization:\s*Bearer\s+\S+/gi, "[REDACTED]");
  const withoutCredential = withoutHeader.replace(/credential[-_:=\s]+\S+/gi, "[REDACTED]");
  return secrets
    .filter((secret) => secret.length > 0)
    .reduce((text, secret) => text.split(secret).join("[REDACTED]"), withoutCredential)
    .slice(0, MAX_ERROR_LENGTH);
};
```

인증 뒤에는 access token을 `secrets`에 전달한다. `ResultEvent.error`, stderr, property 오류는 모두 `redactSensitive`를 통과한다. 인증 실패는 token을 얻기 전이므로 header·credential 패턴 제거를 적용한다.

- [ ] **Step 6: preflight·4xx·입력 오류의 write 경계를 고정한다.**

- `readEvents`와 `loadInventory`를 인증보다 먼저 실행한다.
- `verifyProperty`가 200이 아니거나 property가 없으면 event·summary write 전에 실패한다.
- sitemap 네 개를 모두 fetch·parse·validate한 뒤에만 `saveInventory`를 호출한다.
- `request_error`는 결과를 기록하고 다음 pending URL로 진행한다.
- `auth_error`와 `rate_limited`는 결과를 기록한 뒤 현재 run을 끝낸다.
- malformed event는 행 번호가 포함된 오류로 번역하고 파일을 수정하지 않는다.

Step 4에서 만든 `createFailureResult`의 body를 다음처럼 교체한다. 호출부는 이미 실제 `context.token`을 전달하므로 저장 전 token도 제거된다.

```ts
const createFailureResult = (
  inventory: Inventory,
  attemptId: string,
  url: string,
  status: number | null,
  error: string,
  token: string,
  completedAt: string
): ResultEvent => ({
  type: "result",
  attemptId,
  auditId: inventory.auditId,
  url,
  completedAt,
  httpStatus: status,
  outcome: getFailureOutcome(status),
  error: redactSensitive(error, [token]),
});
```

`runAuditCommand`의 catch도 raw 오류를 직접 출력하지 않도록 교체한다.

```ts
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  dependencies.output.stderr(redactSensitive(message));
  return 1;
}
```

- [ ] **Step 7: 오류 보존 테스트를 다시 실행한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts -t "T-15|T-16|T-17|T-18|T-19" --runInBand
```

Expected: PASS, 5 tests.

- [ ] **Step 8: 관련 파일만 커밋한다.**

```powershell
git add -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
git diff --cached --check
git commit -m "feat(seo): preserve GSC audit data on failures" -- scripts/lib/gsc-index-audit-store.ts scripts/lib/gsc-index-audit.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
```

### Task 6: 실제 GSC CLI를 연결하고 inventory를 생성한다

**Tests:** T-01, T-03, T-04, T-20의 명령 계약을 실제 entry와 package script에 연결한다.

**Files:**

- Create: `scripts/gsc-recipe-index-audit.ts`
- Modify: `package.json`

- [ ] **Step 1: 실제 edge adapter와 CLI entry를 작성한다.**

```ts
import * as crypto from "crypto";
import * as path from "path";

import { getAccessToken, inspectUrl, listSites } from "./lib/gsc";
import {
  AUDIT_PROPERTY,
  runAuditCommand,
  type AuditDependencies,
} from "./lib/gsc-index-audit";

const DATA_DIR = path.resolve(process.cwd(), "docs", "gsc-index-status");
const SITEMAP_BASE = "https://www.recipio.kr/recipes/sitemap";

const parseSitesResponse = (response: string) => {
  const separator = response.indexOf(" ");
  const status = Number(response.slice(0, separator));
  const body = response.slice(separator + 1);
  return {
    status,
    hasProperty:
      status === 200 && /"siteUrl"\s*:\s*"sc-domain:recipio\.kr"/.test(body),
    error: status === 200 ? undefined : body.slice(0, 300),
  };
};

const createLiveDependencies = (): AuditDependencies => ({
  dataDir: DATA_DIR,
  clock: {
    now: () => new Date(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    random: Math.random,
  },
  output: {
    stdout: (message) => console.log(message),
    stderr: (message) => console.error(message),
  },
  sitemap: {
    fetchXml: async (sitemapIndex) => {
      const response = await fetch(`${SITEMAP_BASE}/${sitemapIndex}.xml`);
      if (!response.ok) throw new Error(`Sitemap ${sitemapIndex}: ${response.status}`);
      return response.text();
    },
  },
  gsc: {
    authenticate: getAccessToken,
    verifyProperty: async (token) => parseSitesResponse(await listSites(token)),
    inspect: (token, url) => inspectUrl(token, AUDIT_PROPERTY, url),
  },
  createId: crypto.randomUUID,
});

const main = async () => {
  const exitCode = await runAuditCommand(process.argv.slice(2), createLiveDependencies());
  process.exitCode = exitCode;
};

void main();
```

- [ ] **Step 2: package script를 추가한다.**

`package.json`의 SEO scripts에 다음 항목을 추가한다.

```json
"seo:index-audit": "tsx scripts/gsc-recipe-index-audit.ts"
```

- [ ] **Step 3: 전체 acceptance 테스트를 실행한다.**

Run:

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts --runInBand
```

Expected: PASS, 20 tests.

- [ ] **Step 4: TypeScript와 대상 lint를 실행한다.**

Run:

```powershell
npx tsc --noEmit
npx eslint scripts/gsc-recipe-index-audit.ts scripts/lib/gsc-index-audit.ts scripts/lib/gsc-index-audit-store.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
```

Expected: 두 명령 모두 exit 0. `npm run build`는 실행하지 않는다.

- [ ] **Step 5: live sitemap 0~3 inventory를 생성한다.**

Run:

```powershell
npm run seo:index-audit -- --init
```

Expected:

- `docs/gsc-index-status/inventory.json`이 생성된다.
- source가 정확히 0·1·2·3 네 개다.
- 현재 기준 전체 행 39,131, 중복 41, 고유 URL 39,090이 출력된다. 프로덕션 sitemap이 바뀌었다면 실제 새 개수를 사용하고 네 source·고유 URL 양수·중복 계산 일치만 필수로 본다.
- `git status --short`에는 `docs/gsc-index-status/`가 나타나지 않는다.

- [ ] **Step 6: 외부 호출 없는 summary를 확인한다.**

Run:

```powershell
npm run seo:index-audit -- --summary
```

Expected: 최초에는 `completed=0`, `pending=<inventory 고유 URL 수>`, `indexed=0`이고 `summary.json`이 생성된다.

- [ ] **Step 7: 관련 파일만 커밋한다.**

```powershell
git add -- package.json scripts/gsc-recipe-index-audit.ts
git diff --cached --check
git commit -m "feat(seo): wire resumable GSC index audit CLI" -- package.json scripts/gsc-recipe-index-audit.ts
```

## 최종 검증

- [ ] 모든 요구사항 테스트가 통과하는지 다시 확인한다.

```powershell
npx jest scripts/__tests__/gsc-recipe-index-audit.test.ts --runInBand
npx tsc --noEmit
npx eslint scripts/gsc-recipe-index-audit.ts scripts/lib/gsc-index-audit.ts scripts/lib/gsc-index-audit-store.ts scripts/__tests__/gsc-recipe-index-audit.test.ts
git diff --check
git status --short
```

Expected:

- T-01~T-20이 모두 PASS한다.
- TypeScript와 대상 ESLint가 exit 0이다.
- 새 커밋은 계획에 적힌 정확한 파일만 포함한다.
- 기존 사용자 변경은 그대로 남아 있다.
- `docs/gsc-index-status/` 데이터는 Git에서 무시된다.

## 운영 인계

인증이 준비된 날마다 다음 명령을 한 번 실행한다.

```powershell
npm run seo:index-audit -- --run
```

스크립트는 최근 24시간 자체 시도 1,800회에서 멈추고 다음 실행 가능 시각을 출력한다. 현재 세션에는 GSC credential이 없으므로 구현 검증 중 실제 `--run`은 호출하지 않는다. credential이 연결된 뒤 첫 운영 실행에서 property 접근과 첫 결과 저장을 확인한다.
