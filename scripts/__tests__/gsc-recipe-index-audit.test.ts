/** @jest-environment node */

import { existsSync } from "fs";
import {
  appendFile,
  mkdtemp,
  readFile,
  rm,
  unlink,
  writeFile,
} from "fs/promises";
import { tmpdir } from "os";
import path from "path";

import {
  ATTEMPT_RECORDING_SAFETY_MS,
  type AuditDependencies,
  MAX_ATTEMPTS_24H,
  MIN_REQUEST_INTERVAL_MS,
  redactSensitive,
  type RunAuditCommand,
  runAuditCommand,
} from "../lib/gsc-index-audit";
import {
  appendEvent,
  appendQuotaBasisTime,
  type AuditEvent,
  AuditEventSchema,
  createQuotaWindow,
  getAuditPaths,
  getNextAvailableAt,
  getQuotaWindowState,
  getRateWindow,
  getRecentAttemptEvents,
  type Inventory,
  InventorySchema,
  loadInventory,
  readEvents,
  type Summary,
  SummarySchema,
  updateLatestQuotaBasisTime,
} from "../lib/gsc-index-audit-store";

type AuditFixture = {
  dependencies: AuditDependencies;
  dataDir: string;
  errors: string[];
  gscCalls: string[];
  outputMessages: string[];
  sitemapCalls: number[];
  sleeps: number[];
  elapsedMs: () => number;
};

type RunFixture = AuditFixture & {
  inventory: Inventory;
};

const runCommand: RunAuditCommand = runAuditCommand;

const recipeUrl = (id: string): string =>
  `https://www.recipio.kr/recipes/${id}`;

const sitemapXml = (urls: string[]): string =>
  `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;

const createSitemapGateway = (sitemaps: string[][], calls: number[]) => ({
  fetchXml: async (index: 0 | 1 | 2 | 3) => {
    calls.push(index);
    return sitemapXml(sitemaps[index]);
  },
});

const createIndexedOutcome = (url: string) => ({
  status: 200,
  verdict: "PASS",
  coverageState: "Submitted and indexed",
  indexingState: "INDEXING_ALLOWED",
  robotsTxtState: "ALLOWED",
  pageFetchState: "SUCCESSFUL",
  lastCrawlTime: "2026-08-13T00:00:00.000Z",
  googleCanonical: url,
  userCanonical: url,
  crawledAs: "MOBILE",
  referringUrls: [],
  sitemaps: [],
});

const createGscGateway = (calls: string[]): AuditDependencies["gsc"] => ({
  authenticate: async () => {
    calls.push("authenticate");
    return "access-token";
  },
  verifyProperty: async (token, property) => {
    if (token !== "access-token" || property !== "sc-domain:recipio.kr") {
      throw new Error("unexpected property verification");
    }
    calls.push(`verify:${property}`);
  },
  inspect: async (token, property, url) => {
    if (token !== "access-token" || property !== "sc-domain:recipio.kr") {
      throw new Error("unexpected inspection target");
    }
    calls.push(`inspect:${property}:${url}`);
    return createIndexedOutcome(url);
  },
});

const createFixture = async (sitemaps: string[][]): Promise<AuditFixture> => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "gsc-index-audit-"));
  const errors: string[] = [];
  const gscCalls: string[] = [];
  const outputMessages: string[] = [];
  const sitemapCalls: number[] = [];
  const sleeps: number[] = [];
  const initialNowMs = Date.parse("2026-08-14T00:00:00.000Z");
  let nowMs = initialNowMs;
  let id = 0;

  return {
    dataDir,
    errors,
    gscCalls,
    outputMessages,
    sitemapCalls,
    sleeps,
    elapsedMs: () => nowMs - initialNowMs,
    dependencies: {
      dataDir,
      clock: {
        now: () => new Date(nowMs),
        sleep: async (milliseconds) => {
          sleeps.push(milliseconds);
          nowMs += milliseconds;
        },
        random: () => 0.5,
      },
      output: {
        stdout: (message) => outputMessages.push(message),
        stderr: (message) => errors.push(message),
      },
      sitemap: createSitemapGateway(sitemaps, sitemapCalls),
      gsc: createGscGateway(gscCalls),
      eventStore: { append: appendEvent },
      createId: () => `id-${++id}`,
    },
  };
};

const loadJson = async (filePath: string): Promise<unknown> =>
  JSON.parse(await readFile(filePath, "utf8"));

const loadEvents = async (filePath: string) => {
  const content = await readFile(filePath, "utf8");
  return content
    .trim()
    .split("\n")
    .map((line) => AuditEventSchema.parse(JSON.parse(line)));
};

type AuditFileSnapshot = {
  events: Buffer | null;
  inventory: Buffer | null;
  summary: Buffer | null;
};

const readExistingFile = async (filePath: string): Promise<Buffer | null> =>
  existsSync(filePath) ? readFile(filePath) : null;

const snapshotFiles = async (dataDir: string): Promise<AuditFileSnapshot> => {
  const paths = getAuditPaths(dataDir);
  const [events, inventory, summary] = await Promise.all([
    readExistingFile(paths.events),
    readExistingFile(paths.inventory),
    readExistingFile(paths.summary),
  ]);
  return {
    events,
    inventory,
    summary,
  };
};

const writeSentinelSummary = async (dataDir: string): Promise<void> =>
  writeFile(getAuditPaths(dataDir).summary, "sentinel summary\n", "utf8");

const loadAuditText = async (fixture: AuditFixture): Promise<string> => {
  const paths = getAuditPaths(fixture.dataDir);
  const files = await Promise.all([
    readFile(paths.inventory, "utf8"),
    readFile(paths.events, "utf8"),
    readFile(paths.summary, "utf8"),
  ]);
  return [...files, ...fixture.outputMessages, ...fixture.errors].join("\n");
};

const expectSensitiveValuesRemoved = (text: string, token: string): void => {
  expect(text).not.toContain("credential-super-secret");
  expect(text).not.toContain(token);
  expect(text).not.toMatch(/Authorization\s*(?::|=)?\s*Bearer/i);
  expect(text).toContain("[REDACTED]");
};

const expectSingleRequestError = (events: AuditEvent[], url: string): void => {
  expect(events.filter((event) => event.url === url)).toHaveLength(2);
  expect(
    events.filter((event) => event.type === "result" && event.url === url)
  ).toEqual([
    expect.objectContaining({ outcome: "request_error", status: 400 }),
  ]);
};

type AuditResultEvent = Extract<AuditEvent, { type: "result" }>;

const getResultForUrl = (
  events: AuditEvent[],
  url: string
): AuditResultEvent => {
  const result = events.find(
    (event): event is AuditResultEvent =>
      event.type === "result" && event.url === url
  );
  if (result === undefined) throw new Error(`missing result for ${url}`);
  return result;
};

const expectBoundedResultErrors = (events: AuditEvent[]): void => {
  events
    .filter((event) => event.type === "result")
    .forEach(({ error }) => expect(error?.length).toBeLessThanOrEqual(300));
};

const configureAppendFailure = (
  fixture: AuditFixture,
  failedEventType: AuditEvent["type"],
  token: string
): void => {
  const append = fixture.dependencies.eventStore.append;
  fixture.dependencies.eventStore.append = async (filePath, event) => {
    if (event.type === failedEventType) {
      throw new Error(`storage failed ${token}`);
    }
    await append(filePath, event);
  };
};

const FAILED_APPEND_EVENT_TYPES: AuditEvent["type"][] = ["attempt", "result"];

const createRunFixture = async (ids: string[]): Promise<RunFixture> => {
  const urls = ids.map(recipeUrl);
  const fixture = await createFixture([
    [urls[0]],
    [urls[1] ?? urls[0]],
    [urls[2] ?? urls[0]],
    [urls[3] ?? urls[0]],
  ]);
  await runCommand(["--init"], fixture.dependencies);
  const inventory = await loadInventory(
    getAuditPaths(fixture.dataDir).inventory
  );
  return { ...fixture, inventory };
};

const loadSummary = async (fixture: AuditFixture): Promise<Summary> =>
  SummarySchema.parse(await loadJson(getAuditPaths(fixture.dataDir).summary));

const getConsecutiveIntervals = (starts: number[]): number[] =>
  starts.slice(1).map((startedAt, index) => startedAt - starts[index]);

const appendAttempts = async (
  fixture: RunFixture,
  count: number,
  startedAt: string
): Promise<void> => {
  for (let index = 0; index < count; index += 1) {
    await appendEvent(getAuditPaths(fixture.dataDir).events, {
      type: "attempt",
      auditId: fixture.inventory.auditId,
      attemptId: `existing-attempt-${index}`,
      url: recipeUrl("A"),
      startedAt,
    });
  }
};

const prepareSentinelRunFiles = async (
  fixture: RunFixture
): Promise<AuditFileSnapshot> => {
  await appendAttempts(fixture, 1, "2026-08-13T23:00:00.000Z");
  await writeSentinelSummary(fixture.dataDir);
  return snapshotFiles(fixture.dataDir);
};

type SuccessfulResultInput = {
  attemptId: string;
  completedAt: string;
  coverageState?: string;
  url: string;
  verdict: string;
};

const LATEST_STATUS_RESULTS: SuccessfulResultInput[] = [
  {
    attemptId: "success-A",
    completedAt: "2026-08-13T20:00:00.000Z",
    coverageState: "Submitted and indexed",
    url: recipeUrl("A"),
    verdict: "PASS",
  },
  {
    attemptId: "success-B-old",
    completedAt: "2026-08-13T21:00:00.000Z",
    coverageState: "Discovered - currently not indexed",
    url: recipeUrl("B"),
    verdict: "NEUTRAL",
  },
  {
    attemptId: "success-B-latest",
    completedAt: "2026-08-13T22:00:00.000Z",
    coverageState: "Crawled - currently not indexed",
    url: recipeUrl("B"),
    verdict: "NEUTRAL",
  },
  {
    attemptId: "success-C",
    completedAt: "2026-08-13T23:00:00.000Z",
    url: recipeUrl("C"),
    verdict: "NEUTRAL",
  },
];

const COMPLETE_STATUS_RESULTS = LATEST_STATUS_RESULTS.filter(
  ({ attemptId }) => attemptId !== "success-B-old"
);

const appendSuccessfulResult = async (
  fixture: RunFixture,
  input: SuccessfulResultInput
): Promise<void> =>
  appendEvent(getAuditPaths(fixture.dataDir).events, {
    type: "result",
    auditId: fixture.inventory.auditId,
    outcome: "success",
    status: 200,
    ...input,
  });

const appendSuccessfulResults = async (
  fixture: RunFixture,
  inputs: SuccessfulResultInput[]
): Promise<void> => {
  for (const input of inputs) {
    await appendSuccessfulResult(fixture, input);
  }
};

type ApiFailureOutcome =
  | "rate_limited"
  | "auth_error"
  | "request_error"
  | "retryable_error";

const appendApiFailure = async (
  fixture: RunFixture,
  url: string,
  completedAt: string,
  outcome: ApiFailureOutcome
): Promise<void> =>
  appendEvent(getAuditPaths(fixture.dataDir).events, {
    type: "result",
    auditId: fixture.inventory.auditId,
    attemptId: `failed-${url}`,
    url,
    completedAt,
    outcome,
    status: 500,
    error: "request failed",
  });

const appendRequestError = async (
  fixture: RunFixture,
  url: string,
  completedAt: string
): Promise<void> =>
  appendApiFailure(fixture, url, completedAt, "request_error");

const expectLatestStatusSummary = (
  summary: Summary,
  inventory: Inventory
): void => {
  expect(summary).toEqual({
    auditId: inventory.auditId,
    generatedAt: "2026-08-14T00:00:00.000Z",
    property: "sc-domain:recipio.kr",
    totalUrls: 4,
    completedUrls: 3,
    pendingUrls: 1,
    indexed: 1,
    coverageStateCounts: {
      "Crawled - currently not indexed": 1,
      "(coverageState 없음)": 1,
    },
    apiFailureCounts: { request_error: 1 },
    firstCheckedAt: "2026-08-13T20:00:00.000Z",
    lastCheckedAt: "2026-08-13T23:00:00.000Z",
    recentAttempts: 0,
    nextAvailableAt: null,
  });
};

const expectLatestStatusOutput = (messages: string[]): void => {
  expect(messages).toEqual([
    "rows=4 duplicates=0 unique=4",
    "total=4 completed=3 pending=1",
    'statusCounts={"indexed":1,"Crawled - currently not indexed":1,"(coverageState 없음)":1}',
    'apiFailureCounts={"request_error":1}',
    "recentAttempts=0 nextAvailableAt=-",
  ]);
};

describe("recipe GSC index audit walking skeleton", () => {
  const directories: string[] = [];

  afterEach(async () => {
    await Promise.all(
      directories
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true }))
    );
  });

  test("T-01: 중복 URL은 하나로 저장하면서 모든 sitemap 출처를 보존합니다", async () => {
    const fixture = await createFixture([
      [recipeUrl("A"), recipeUrl("B")],
      [recipeUrl("B"), recipeUrl("C")],
      [recipeUrl("D")],
      [recipeUrl("E")],
    ]);
    directories.push(fixture.dataDir);

    await expect(runCommand(["--init"], fixture.dependencies)).resolves.toBe(0);

    const paths = getAuditPaths(fixture.dataDir);
    const inventory = InventorySchema.parse(await loadJson(paths.inventory));
    expect(inventory.sources.map(({ rowCount }) => rowCount)).toEqual([
      2, 2, 1, 1,
    ]);
    expect(inventory.duplicateRows).toBe(1);
    expect(inventory.urls).toHaveLength(5);
    expect(
      inventory.urls.find(({ url }) => url === recipeUrl("B"))?.sitemapIndexes
    ).toEqual([0, 1]);
    expect(fixture.sitemapCalls).toEqual([0, 1, 2, 3]);
    expect(fixture.outputMessages).toEqual(["rows=6 duplicates=1 unique=5"]);
  });

  test.each([
    [
      "외부 origin",
      [
        ["https://example.com/recipes/A"],
        [recipeUrl("B")],
        [recipeUrl("C")],
        [recipeUrl("D")],
      ],
    ],
    [
      "상세가 아닌 path",
      [
        ["https://www.recipio.kr/search/A"],
        [recipeUrl("B")],
        [recipeUrl("C")],
        [recipeUrl("D")],
      ],
    ],
    [
      "예약 세그먼트",
      [
        [recipeUrl("new")],
        [recipeUrl("B")],
        [recipeUrl("C")],
        [recipeUrl("D")],
      ],
    ],
    ["빈 sitemap", [[recipeUrl("A")], [], [recipeUrl("C")], [recipeUrl("D")]]],
  ])(
    "T-17: %s 입력이면 기존 조사 파일을 보존합니다",
    async (_label, sitemaps) => {
      const fixture = await createFixture(sitemaps);
      directories.push(fixture.dataDir);
      const paths = getAuditPaths(fixture.dataDir);
      await writeFile(paths.events, "sentinel events\n", "utf8");
      await writeSentinelSummary(fixture.dataDir);
      const before = await snapshotFiles(fixture.dataDir);

      await expect(runCommand(["--init"], fixture.dependencies)).resolves.toBe(
        1
      );

      expect(fixture.errors).not.toEqual([]);
      expect(fixture.gscCalls).toEqual([]);
      expect(await snapshotFiles(fixture.dataDir)).toEqual(before);
    }
  );

  test("T-03: 한 번 실행해 모든 미완료 URL의 결과를 이벤트와 요약에 반영합니다", async () => {
    const fixture = await createFixture([
      [recipeUrl("A")],
      [recipeUrl("B")],
      [recipeUrl("C")],
      [recipeUrl("D")],
    ]);
    directories.push(fixture.dataDir);

    await runCommand(["--init"], fixture.dependencies);
    const exitCode = await runCommand(["--run"], fixture.dependencies);

    expect(fixture.errors).toEqual([]);
    expect(exitCode).toBe(0);

    const paths = getAuditPaths(fixture.dataDir);
    const events = await loadEvents(paths.events);
    expect(events.map(({ type }) => type)).toEqual([
      "attempt",
      "result",
      "attempt",
      "result",
      "attempt",
      "result",
      "attempt",
      "result",
    ]);
    expect(events[0].attemptId).toBe(events[1].attemptId);
    expect(events[1]).toMatchObject({
      url: recipeUrl("A"),
      verdict: "PASS",
      pageFetchState: "SUCCESSFUL",
    });

    const summary = SummarySchema.parse(await loadJson(paths.summary));
    expect(summary).toMatchObject({
      totalUrls: 4,
      completedUrls: 4,
      pendingUrls: 0,
      indexed: 4,
    });
  });

  test("T-04: 저장 이벤트만으로 같은 요약을 다시 만들고 외부 호출은 하지 않습니다", async () => {
    const fixture = await createFixture([
      [recipeUrl("A")],
      [recipeUrl("B")],
      [recipeUrl("C")],
      [recipeUrl("D")],
    ]);
    directories.push(fixture.dataDir);
    const paths = getAuditPaths(fixture.dataDir);

    await runCommand(["--init"], fixture.dependencies);
    await runCommand(["--run"], fixture.dependencies);
    const before = SummarySchema.parse(await loadJson(paths.summary));
    await unlink(paths.summary);
    fixture.gscCalls.length = 0;
    fixture.sitemapCalls.length = 0;

    await expect(runCommand(["--summary"], fixture.dependencies)).resolves.toBe(
      0
    );

    const after = SummarySchema.parse(await loadJson(paths.summary));
    expect(after).toEqual(before);
    expect(fixture.gscCalls).toEqual([]);
    expect(fixture.sitemapCalls).toEqual([]);
  });

  test("Task 1: 다른 auditId의 성공 결과는 현재 첫 URL을 완료 처리하지 않습니다", async () => {
    const fixture = await createFixture([
      [recipeUrl("A")],
      [recipeUrl("B")],
      [recipeUrl("C")],
      [recipeUrl("D")],
    ]);
    directories.push(fixture.dataDir);
    const paths = getAuditPaths(fixture.dataDir);
    await runCommand(["--init"], fixture.dependencies);
    const inventory = await loadInventory(paths.inventory);
    const firstUrl = inventory.urls[0].url;
    await appendEvent(paths.events, {
      type: "result",
      auditId: "different-audit",
      attemptId: "foreign-attempt",
      url: firstUrl,
      completedAt: "2026-08-13T00:00:00.000Z",
      outcome: "success",
      status: 200,
      verdict: "PASS",
    });

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expect(fixture.gscCalls).toContain(
      `inspect:sc-domain:recipio.kr:${firstUrl}`
    );
    const summary = SummarySchema.parse(await loadJson(paths.summary));
    expect(summary).toMatchObject({ completedUrls: 4, pendingUrls: 0 });
  });

  test("Task 1: source index가 0부터 3까지 정확히 한 번씩 없으면 inventory를 거부합니다", () => {
    const result = InventorySchema.safeParse({
      auditId: "audit-1",
      createdAt: "2026-08-14T00:00:00.000Z",
      property: "sc-domain:recipio.kr",
      sources: [0, 1, 3, 3].map((index) => ({
        index,
        url: `https://www.recipio.kr/recipes/sitemap/${index}.xml`,
        rowCount: 1,
      })),
      duplicateRows: 0,
      urls: [{ url: recipeUrl("A"), sitemapIndexes: [0] }],
    });

    expect(result.success).toBe(false);
  });

  test("Task 1: malformed JSONL은 빈 줄을 포함한 원본 행 번호를 보고합니다", async () => {
    const dataDir = await mkdtemp(path.join(tmpdir(), "gsc-index-audit-"));
    directories.push(dataDir);
    const paths = getAuditPaths(dataDir);
    const validEvent = JSON.stringify({
      type: "attempt",
      auditId: "audit-1",
      attemptId: "attempt-1",
      url: recipeUrl("A"),
      startedAt: "2026-08-14T00:00:00.000Z",
    });
    await writeFile(paths.events, `\n${validEvent}\n{broken\n`, "utf8");

    await expect(readEvents(paths.events)).rejects.toThrow("line 3");
  });

  test.each([[[]], [["--init", "--run"]], [["--unknown"]]])(
    "T-20: invalid command args %j do not mutate audit files or call gateways",
    async (args) => {
      const fixture = await createFixture([
        [recipeUrl("A")],
        [recipeUrl("B")],
        [recipeUrl("C")],
        [recipeUrl("D")],
      ]);
      directories.push(fixture.dataDir);
      const paths = getAuditPaths(fixture.dataDir);
      await writeFile(paths.events, "sentinel events\n", "utf8");
      const beforeEvents = await readFile(paths.events);

      await expect(runCommand(args, fixture.dependencies)).resolves.toBe(1);

      expect(fixture.sitemapCalls).toEqual([]);
      expect(fixture.gscCalls).toEqual([]);
      expect(await readFile(paths.events)).toEqual(beforeEvents);
      expect(existsSync(paths.inventory)).toBe(false);
      expect(existsSync(paths.summary)).toBe(false);
      expect(fixture.errors.join("\n")).toContain(
        "Usage: --init | --run | --summary"
      );
    }
  );

  test("T-02: repeated init preserves existing audit files without fetching sitemaps", async () => {
    const fixture = await createFixture([
      [recipeUrl("A")],
      [recipeUrl("B")],
      [recipeUrl("C")],
      [recipeUrl("D")],
    ]);
    directories.push(fixture.dataDir);
    const paths = getAuditPaths(fixture.dataDir);

    await expect(runCommand(["--init"], fixture.dependencies)).resolves.toBe(0);
    await writeFile(paths.events, "sentinel events\n", "utf8");
    await writeFile(paths.summary, "sentinel summary\n", "utf8");
    const before = {
      inventory: await readFile(paths.inventory),
      events: await readFile(paths.events),
      summary: await readFile(paths.summary),
    };
    fixture.sitemapCalls.length = 0;

    await expect(runCommand(["--init"], fixture.dependencies)).resolves.toBe(1);

    expect(fixture.sitemapCalls).toEqual([]);
    expect(await readFile(paths.inventory)).toEqual(before.inventory);
    expect(await readFile(paths.events)).toEqual(before.events);
    expect(await readFile(paths.summary)).toEqual(before.summary);
  });

  test("T-06: 재개 시 완료 URL을 건너뛰고 미완료 URL만 검사합니다", async () => {
    const fixture = await createRunFixture(["A", "B"]);
    directories.push(fixture.dataDir);
    await appendSuccessfulResult(fixture, {
      attemptId: "completed-A",
      completedAt: "2026-08-13T22:00:00.000Z",
      coverageState: "Submitted and indexed",
      url: recipeUrl("A"),
      verdict: "PASS",
    });

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expect(fixture.gscCalls).toEqual([
      "authenticate",
      "verify:sc-domain:recipio.kr",
      `inspect:sc-domain:recipio.kr:${recipeUrl("B")}`,
    ]);
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 2,
      pendingUrls: 0,
    });
    fixture.gscCalls.length = 0;

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expect(fixture.gscCalls).toEqual([]);
  });

  test("T-07: 결과 없는 시도는 재검사하고 최근 24시간 시도에 포함합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    await appendEvent(getAuditPaths(fixture.dataDir).events, {
      type: "attempt",
      auditId: fixture.inventory.auditId,
      attemptId: "orphan-attempt",
      url: recipeUrl("A"),
      startedAt: "2026-08-13T23:00:00.000Z",
    });
    await appendEvent(getAuditPaths(fixture.dataDir).events, {
      type: "attempt",
      auditId: "different-audit",
      attemptId: "other-audit-attempt",
      url: recipeUrl("outside-inventory"),
      startedAt: "2026-08-13T22:00:00.000Z",
    });
    await appendEvent(getAuditPaths(fixture.dataDir).events, {
      type: "attempt",
      auditId: "different-audit",
      attemptId: "cutoff-attempt",
      url: recipeUrl("outside-inventory"),
      startedAt: "2026-08-13T00:00:00.000Z",
    });

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expect(fixture.gscCalls).toContain(
      `inspect:sc-domain:recipio.kr:${recipeUrl("A")}`
    );
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 1,
      pendingUrls: 0,
      recentAttempts: 3,
    });
  });

  test("T-08: 재개 시 sitemap을 다시 읽지 않고 저장된 inventory 순서를 사용합니다", async () => {
    const fixture = await createRunFixture(["A", "B", "C"]);
    directories.push(fixture.dataDir);
    fixture.sitemapCalls.length = 0;
    fixture.dependencies.sitemap = createSitemapGateway(
      [[recipeUrl("Z")], [recipeUrl("Z")], [recipeUrl("Z")], [recipeUrl("Z")]],
      fixture.sitemapCalls
    );

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expect(fixture.sitemapCalls).toEqual([]);
    expect(fixture.gscCalls).toEqual([
      "authenticate",
      "verify:sc-domain:recipio.kr",
      `inspect:sc-domain:recipio.kr:${recipeUrl("A")}`,
      `inspect:sc-domain:recipio.kr:${recipeUrl("B")}`,
      `inspect:sc-domain:recipio.kr:${recipeUrl("C")}`,
    ]);
  });

  test("T-05: 최신 성공 상태와 미완료 URL의 최신 API 실패만 요약합니다", async () => {
    const fixture = await createRunFixture(["A", "B", "C", "D"]);
    directories.push(fixture.dataDir);
    await appendRequestError(
      fixture,
      recipeUrl("A"),
      "2026-08-13T19:00:00.000Z"
    );
    await appendSuccessfulResults(fixture, LATEST_STATUS_RESULTS);
    await appendApiFailure(
      fixture,
      recipeUrl("D"),
      "2026-08-13T23:15:00.000Z",
      "retryable_error"
    );
    await appendRequestError(
      fixture,
      recipeUrl("D"),
      "2026-08-13T23:30:00.000Z"
    );

    await expect(runCommand(["--summary"], fixture.dependencies)).resolves.toBe(
      0
    );

    expectLatestStatusSummary(await loadSummary(fixture), fixture.inventory);
    expectLatestStatusOutput(fixture.outputMessages);
  });

  test("T-09: 완료 시 상태별 개수의 합이 전체 URL 개수와 같습니다", async () => {
    const fixture = await createRunFixture(["A", "B", "C"]);
    directories.push(fixture.dataDir);
    await appendSuccessfulResults(fixture, COMPLETE_STATUS_RESULTS);

    await expect(runCommand(["--summary"], fixture.dependencies)).resolves.toBe(
      0
    );

    const summary = await loadSummary(fixture);
    const coverageTotal = Object.values(summary.coverageStateCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    expect(summary).toMatchObject({
      totalUrls: 3,
      completedUrls: 3,
      pendingUrls: 0,
      indexed: 1,
    });
    expect(summary.indexed + coverageTotal).toBe(summary.totalUrls);
  });

  test("Task 4: quota window는 최초 fold 뒤 cursor와 마지막 basis만 갱신합니다", () => {
    const events = [
      {
        type: "attempt",
        auditId: "audit-1",
        attemptId: "expired",
        url: recipeUrl("expired"),
        startedAt: "2026-08-12T23:00:00.000Z",
      },
      {
        type: "attempt",
        auditId: "audit-1",
        attemptId: "recent-a",
        url: recipeUrl("A"),
        startedAt: "2026-08-13T01:00:00.000Z",
      },
      {
        type: "attempt",
        auditId: "audit-1",
        attemptId: "recent-b",
        url: recipeUrl("B"),
        startedAt: "2026-08-13T02:00:00.000Z",
      },
      {
        type: "result",
        auditId: "audit-1",
        attemptId: "recent-b",
        url: recipeUrl("B"),
        completedAt: "2026-08-13T03:00:00.000Z",
        outcome: "retryable_error",
        status: 500,
      },
    ].map((event) => AuditEventSchema.parse(event));
    const window = createQuotaWindow(events);

    expect(
      getQuotaWindowState(window, new Date("2026-08-14T00:00:00.000Z"), 2)
    ).toEqual({
      recentAttempts: 2,
      nextAvailableAt: "2026-08-14T01:00:00.000Z",
    });

    appendQuotaBasisTime(window, Date.parse("2026-08-14T00:01:00.000Z"));
    updateLatestQuotaBasisTime(window, Date.parse("2026-08-14T00:02:00.000Z"));

    expect(
      getQuotaWindowState(window, new Date("2026-08-14T00:02:00.000Z"), 1)
    ).toEqual({
      recentAttempts: 3,
      nextAvailableAt: "2026-08-15T00:02:00.000Z",
    });
    expect(
      getQuotaWindowState(window, new Date("2026-08-14T02:00:00.000Z"), 2)
    ).toEqual({
      recentAttempts: 2,
      nextAvailableAt: "2026-08-14T03:00:00.000Z",
    });
  });

  test("Task 4: wall clock이 역행하면 만료 cursor와 정렬 순서를 복구합니다", () => {
    const events = [
      AuditEventSchema.parse({
        type: "attempt",
        auditId: "audit-1",
        attemptId: "boundary",
        url: recipeUrl("A"),
        startedAt: "2026-08-13T00:00:00.000Z",
      }),
    ];
    const window = createQuotaWindow(events);

    expect(
      getQuotaWindowState(window, new Date("2026-08-14T00:00:01.000Z"), 1)
        .recentAttempts
    ).toBe(0);
    expect(
      getQuotaWindowState(window, new Date("2026-08-13T23:59:59.000Z"), 1)
        .recentAttempts
    ).toBe(1);

    const rolledBackBasis = Date.parse("2026-08-12T23:59:59.500Z");
    appendQuotaBasisTime(window, rolledBackBasis);

    const state = getQuotaWindowState(
      window,
      new Date("2026-08-13T23:59:59.000Z"),
      2
    );
    expect(state.recentAttempts).toBe(2);
    expect(Date.parse(state.nextAvailableAt ?? "")).toBeGreaterThanOrEqual(
      rolledBackBasis + 24 * 60 * 60 * 1000
    );
  });

  test("Task 4: 만료 영역의 현재 attempt를 완료 시각에 맞춰 반복 재배치합니다", () => {
    const now = new Date("2026-08-14T00:00:00.000Z");
    const cutoff = Date.parse("2026-08-13T00:00:00.000Z");
    const nextBasis = Date.parse("2026-08-13T00:00:10.000Z");
    const laterBasis = Date.parse("2026-08-13T00:00:20.000Z");
    const existingEvents = [
      { attemptId: "cutoff", startedAt: cutoff },
      { attemptId: "next", startedAt: nextBasis },
      { attemptId: "later", startedAt: laterBasis },
    ].map(({ attemptId, startedAt }) =>
      AuditEventSchema.parse({
        type: "attempt",
        auditId: "audit-1",
        attemptId,
        url: recipeUrl(attemptId),
        startedAt: new Date(startedAt).toISOString(),
      })
    );
    const currentAttempt = AuditEventSchema.parse({
      type: "attempt",
      auditId: "audit-1",
      attemptId: "current",
      url: recipeUrl("current"),
      startedAt: new Date(cutoff - 1_000).toISOString(),
      quotaBasisAt: new Date(cutoff).toISOString(),
    });
    const window = createQuotaWindow(existingEvents);

    expect(getQuotaWindowState(window, now, 3).recentAttempts).toBe(2);
    appendQuotaBasisTime(window, cutoff);
    expect(getQuotaWindowState(window, now, 3).recentAttempts).toBe(2);

    const firstCompletedAt = Date.parse("2026-08-13T00:00:15.000Z");
    const firstResult = AuditEventSchema.parse({
      type: "result",
      auditId: "audit-1",
      attemptId: "current",
      url: recipeUrl("current"),
      completedAt: new Date(firstCompletedAt).toISOString(),
      outcome: "retryable_error",
      status: 500,
    });
    updateLatestQuotaBasisTime(window, firstCompletedAt);

    expect(getQuotaWindowState(window, now, 3)).toEqual(
      getRateWindow([...existingEvents, currentAttempt, firstResult], now, 3)
    );
    expect(window.basisTimes).toEqual(
      [...window.basisTimes].sort((left, right) => left - right)
    );

    const secondCompletedAt = Date.parse("2026-08-13T00:00:30.000Z");
    const secondResult = AuditEventSchema.parse({
      ...firstResult,
      completedAt: new Date(secondCompletedAt).toISOString(),
    });
    updateLatestQuotaBasisTime(window, secondCompletedAt);

    const replay = getRateWindow(
      [...existingEvents, currentAttempt, firstResult, secondResult],
      now,
      3
    );
    expect(getQuotaWindowState(window, now, 3)).toEqual(replay);
    expect(window.basisTimes).toEqual(
      [...window.basisTimes].sort((left, right) => left - right)
    );
    expect(window.basisTimes).toContain(laterBasis);
    expect(window.basisTimes).toContain(secondCompletedAt);
    expect(window.basisTimes).not.toContain(firstCompletedAt);
  });

  test("T-12: 연속 Inspection 요청 시작은 최소 250ms 간격을 유지합니다", async () => {
    const fixture = await createRunFixture(["A", "B", "C"]);
    directories.push(fixture.dataDir);
    const inspectStarts: number[] = [];
    const inspectedUrls: string[] = [];
    fixture.dependencies.gsc.inspect = async (_token, _property, url) => {
      inspectStarts.push(fixture.elapsedMs());
      inspectedUrls.push(url);
      return createIndexedOutcome(url);
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expect(inspectedUrls).toEqual([
      recipeUrl("A"),
      recipeUrl("B"),
      recipeUrl("C"),
    ]);
    expect(inspectStarts).toHaveLength(3);
    getConsecutiveIntervals(inspectStarts).forEach((interval) => {
      expect(interval).toBeGreaterThanOrEqual(MIN_REQUEST_INTERVAL_MS);
    });
  });

  test("T-12: attempt 기록이 200ms 걸려도 실제 요청 간격과 quota 만료 시각은 안전합니다", async () => {
    const fixture = await createRunFixture(["A", "B"]);
    directories.push(fixture.dataDir);
    const append = fixture.dependencies.eventStore.append;
    const inspectStarts: number[] = [];
    let attemptAppendCount = 0;
    fixture.dependencies.eventStore.append = async (filePath, event) => {
      await append(filePath, event);
      if (event.type === "attempt") {
        attemptAppendCount += 1;
        if (attemptAppendCount === 1) {
          await fixture.dependencies.clock.sleep(200);
        }
      }
    };
    fixture.dependencies.gsc.inspect = async (_token, _property, url) => {
      inspectStarts.push(fixture.elapsedMs());
      return createIndexedOutcome(url);
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    const attempts = events.filter((event) => event.type === "attempt");
    expect(inspectStarts).toHaveLength(2);
    expect(inspectStarts[0]).toBeGreaterThanOrEqual(200);
    getConsecutiveIntervals(inspectStarts).forEach((interval) => {
      expect(interval).toBeGreaterThanOrEqual(MIN_REQUEST_INTERVAL_MS);
    });
    const initialNowMs = Date.parse("2026-08-14T00:00:00.000Z");
    attempts.forEach(({ quotaBasisAt }, index) => {
      const actualStartedAt = initialNowMs + (inspectStarts[index] ?? Infinity);
      expect(Date.parse(quotaBasisAt ?? "")).toBeGreaterThanOrEqual(
        actualStartedAt
      );
    });
    const nextAvailableAt = getNextAvailableAt(
      events,
      fixture.dependencies.clock.now(),
      2
    );
    expect(Date.parse(nextAvailableAt ?? "")).toBeGreaterThanOrEqual(
      initialNowMs + (inspectStarts[0] ?? Infinity) + 24 * 60 * 60 * 1000
    );
  });

  test("T-12: attempt 기록이 safety window를 넘으면 Inspection을 시작하지 않습니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const append = fixture.dependencies.eventStore.append;
    fixture.dependencies.eventStore.append = async (filePath, event) => {
      await append(filePath, event);
      if (event.type === "attempt") {
        await fixture.dependencies.clock.sleep(ATTEMPT_RECORDING_SAFETY_MS + 1);
      }
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expect(fixture.gscCalls).toEqual([
      "authenticate",
      "verify:sc-domain:recipio.kr",
    ]);
    const attempts = events.filter((event) => event.type === "attempt");
    expect(attempts).toHaveLength(1);
    expect(events.filter((event) => event.type === "result")).toEqual([]);
    const quotaBasisAt = Date.parse(attempts[0]?.quotaBasisAt ?? "");
    const nextAvailableAt = getNextAvailableAt(
      events,
      fixture.dependencies.clock.now(),
      1
    );
    expect(Date.parse(nextAvailableAt ?? "")).toBeGreaterThanOrEqual(
      quotaBasisAt + 24 * 60 * 60 * 1000
    );
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 0,
      pendingUrls: 1,
      recentAttempts: 1,
    });
  });

  test("T-10: 최근 24시간 한도가 찼으면 인증 없이 다음 가능 시각을 저장합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const oldestStartedAt = "2026-08-13T01:00:00.000Z";
    const nextAvailableAt = "2026-08-14T01:00:00.000Z";
    await appendAttempts(fixture, MAX_ATTEMPTS_24H, oldestStartedAt);

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expect(fixture.gscCalls).toEqual([]);
    expect(
      getRecentAttemptEvents(events, fixture.dependencies.clock.now())
    ).toHaveLength(MAX_ATTEMPTS_24H);
    expect(await loadSummary(fixture)).toMatchObject({
      recentAttempts: MAX_ATTEMPTS_24H,
      nextAvailableAt,
    });
    expect(fixture.outputMessages).toContain(
      `recentAttempts=${MAX_ATTEMPTS_24H} nextAvailableAt=${nextAvailableAt}`
    );
  });

  test("T-11: 마지막 allowance를 사용한 뒤 다음 URL을 호출하지 않습니다", async () => {
    const fixture = await createRunFixture(["A", "B"]);
    directories.push(fixture.dataDir);
    await appendAttempts(
      fixture,
      MAX_ATTEMPTS_24H - 1,
      "2026-08-13T01:00:00.000Z"
    );

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expect(fixture.gscCalls).toEqual([
      "authenticate",
      "verify:sc-domain:recipio.kr",
      `inspect:sc-domain:recipio.kr:${recipeUrl("A")}`,
    ]);
    expect(
      getRecentAttemptEvents(events, fixture.dependencies.clock.now())
    ).toHaveLength(MAX_ATTEMPTS_24H);
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 1,
      pendingUrls: 1,
      recentAttempts: MAX_ATTEMPTS_24H,
      nextAvailableAt: "2026-08-14T01:00:00.000Z",
    });
  });

  test("T-11: retry allowance가 없으면 backoff와 재호출 없이 중단합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    await appendAttempts(
      fixture,
      MAX_ATTEMPTS_24H - 1,
      "2026-08-13T01:00:00.000Z"
    );
    let inspectCount = 0;
    fixture.dependencies.gsc.inspect = async () => {
      inspectCount += 1;
      throw new Error("network failed");
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expect(inspectCount).toBe(1);
    expect(fixture.sleeps).toEqual([]);
    expect(
      getRecentAttemptEvents(events, fixture.dependencies.clock.now())
    ).toHaveLength(MAX_ATTEMPTS_24H);
    expect(await loadSummary(fixture)).toMatchObject({
      pendingUrls: 1,
      apiFailureCounts: { retryable_error: 1 },
    });
  });

  test("T-13: network 및 5xx는 두 번만 backoff 재시도하고 URL을 pending으로 둡니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    let inspectCount = 0;
    fixture.dependencies.gsc.inspect = async () => {
      inspectCount += 1;
      if (inspectCount === 1) {
        throw new Error("network failed with access-token");
      }
      return { status: 500, error: "server failed with access-token" };
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    const results = events.filter((event) => event.type === "result");
    expect(inspectCount).toBe(3);
    expect(events.filter((event) => event.type === "attempt")).toHaveLength(3);
    expect(results).toHaveLength(3);
    expect(results.map(({ status }) => status)).toEqual([null, 500, 500]);
    expect(JSON.stringify(results)).not.toContain("access-token");
    expect(fixture.sleeps).toEqual([1125, 2125]);
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 0,
      pendingUrls: 1,
      apiFailureCounts: { retryable_error: 1 },
    });
  });

  test("T-14: 429 응답은 현재 URL 결과를 기록하고 run을 즉시 중단합니다", async () => {
    const fixture = await createRunFixture(["A", "B"]);
    directories.push(fixture.dataDir);
    const inspectedUrls: string[] = [];
    fixture.dependencies.gsc.inspect = async (_token, _property, url) => {
      inspectedUrls.push(url);
      return { status: 429, error: "quota exhausted" };
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expect(inspectedUrls).toEqual([recipeUrl("A")]);
    expect(events.filter((event) => event.type === "attempt")).toHaveLength(1);
    expect(events.filter((event) => event.type === "result")).toEqual([
      expect.objectContaining({
        url: recipeUrl("A"),
        outcome: "rate_limited",
        status: 429,
      }),
    ]);
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 0,
      pendingUrls: 2,
      apiFailureCounts: { rate_limited: 1 },
    });
  });

  test("T-15: property 확인 실패 시 기존 조사 파일을 그대로 보존합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    await appendAttempts(fixture, 1, "2026-08-13T23:00:00.000Z");
    await writeSentinelSummary(fixture.dataDir);
    const before = await snapshotFiles(fixture.dataDir);
    fixture.dependencies.gsc.verifyProperty = async (_token, property) => {
      fixture.gscCalls.push(`verify:${property}`);
      throw new Error("403 denied");
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(1);

    expect(fixture.gscCalls).toEqual([
      "authenticate",
      "verify:sc-domain:recipio.kr",
    ]);
    expect(await snapshotFiles(fixture.dataDir)).toEqual(before);
  });

  test("T-16: 400 실패 URL은 pending으로 남기고 다음 URL을 계속 검사합니다", async () => {
    const fixture = await createRunFixture(["A", "B"]);
    directories.push(fixture.dataDir);
    fixture.dependencies.gsc.inspect = async (_token, _property, url) => {
      fixture.gscCalls.push(`inspect:${url}`);
      if (url === recipeUrl("A")) {
        return {
          status: 400,
          error: `bad request credential-super-secret Authorization Bearer access-token ${"x".repeat(400)}`,
        };
      }
      return createIndexedOutcome(url);
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expect(fixture.gscCalls).toEqual([
      "authenticate",
      "verify:sc-domain:recipio.kr",
      `inspect:${recipeUrl("A")}`,
      `inspect:${recipeUrl("B")}`,
    ]);
    expectSingleRequestError(events, recipeUrl("A"));
    const requestError = getResultForUrl(events, recipeUrl("A"));
    expectSensitiveValuesRemoved(requestError.error ?? "", "access-token");
    expect(requestError.error?.length).toBeLessThanOrEqual(300);
    expect(await loadSummary(fixture)).toMatchObject({
      completedUrls: 1,
      pendingUrls: 1,
      apiFailureCounts: { request_error: 1 },
    });
  });

  test("T-18: 잘못된 events 3행은 외부 호출과 파일 변경 없이 종료합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    await appendAttempts(fixture, 2, "2026-08-13T23:00:00.000Z");
    await appendFile(
      getAuditPaths(fixture.dataDir).events,
      "{broken\n",
      "utf8"
    );
    await writeSentinelSummary(fixture.dataDir);
    const before = await snapshotFiles(fixture.dataDir);

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(1);

    expect(fixture.errors.join("\n")).toContain("events.jsonl line 3");
    expect(fixture.gscCalls).toEqual([]);
    expect(await snapshotFiles(fixture.dataDir)).toEqual(before);
  });

  test("T-19: 검사 오류의 credential과 access token을 어디에도 남기지 않습니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const token = "token-super-secret";
    fixture.dependencies.gsc.authenticate = async () => token;
    fixture.dependencies.gsc.verifyProperty = async () => undefined;
    fixture.dependencies.gsc.inspect = async () => {
      throw new Error(
        `network denied credential-super-secret Authorization: Bearer ${token} ${"x".repeat(400)}`
      );
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    expectSensitiveValuesRemoved(await loadAuditText(fixture), token);
    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    expectBoundedResultErrors(events);
  });

  test("T-19: property 확인 오류도 비밀값을 지우고 파일을 보존합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const token = "token-super-secret";
    await appendAttempts(fixture, 1, "2026-08-13T23:00:00.000Z");
    await writeSentinelSummary(fixture.dataDir);
    const before = await snapshotFiles(fixture.dataDir);
    fixture.dependencies.gsc.authenticate = async () => token;
    fixture.dependencies.gsc.verifyProperty = async () => {
      throw new Error(
        `property denied credential-super-secret Authorization: Bearer ${token}`
      );
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(1);

    const combined = [...fixture.outputMessages, ...fixture.errors].join("\n");
    expectSensitiveValuesRemoved(combined, token);
    expect(await snapshotFiles(fixture.dataDir)).toEqual(before);
  });

  test.each([
    ["Authorization colon", "Authorization: Bearer auth-secret"],
    ["Authorization space", "Authorization Bearer auth-secret"],
    ["Authorization equals", "Authorization=Bearer auth-secret"],
    ["Authorization lowercase", "authorization bearer auth-secret"],
    ["credential dash", "credential-credential-secret"],
    ["credential equals", "credential=credential-secret"],
    ["credentials equals", "credentials=credential-secret"],
    ["client secret underscore", "client_secret=credential-secret"],
    ["client secret dash", "client-secret: credential-secret"],
    ["private key underscore", "private_key=credential-secret"],
    ["private key dash", "private-key: credential-secret"],
  ])("T-19: %s 변형을 오류에서 제거합니다", (_label, sensitive) => {
    expect(redactSensitive(`before ${sensitive} after`)).toBe(
      "before [REDACTED] after"
    );
  });

  test.each([
    [
      "Authorization double quote",
      '{"Authorization":"Bearer alpha123"}',
      '{"Authorization":"[REDACTED]"}',
    ],
    [
      "client secret double quote",
      '{"client_secret":"beta456"}',
      '{"client_secret":"[REDACTED]"}',
    ],
    [
      "private key escaped newline",
      '{"private_key":"gamma789\\nline-two"}',
      '{"private_key":"[REDACTED]"}',
    ],
    [
      "credentials single quote",
      "{'credentials':'delta012'}",
      "{'credentials':'[REDACTED]'}",
    ],
    [
      "client secret dash single quote",
      "{'client-secret':'epsilon345'}",
      "{'client-secret':'[REDACTED]'}",
    ],
    [
      "private key dash single quote",
      "{'private-key':'zeta678'}",
      "{'private-key':'[REDACTED]'}",
    ],
  ])("T-19: %s JSON 값을 전부 제거합니다", (_label, message, expected) => {
    expect(redactSensitive(message)).toBe(expected);
  });

  test("T-19: secret assignment가 아닌 credentials 진단은 보존합니다", () => {
    const message = "No credentials are configured";
    expect(redactSensitive(message)).toBe(message);
  });

  test("T-19: 닫히지 않은 Authorization 인용값도 끝까지 제거합니다", () => {
    const redacted = redactSensitive(
      'request failed {"Authorization":"Bearer auth-secret'
    );
    expect(redacted).not.toContain("auth-secret");
    expect(redacted).toContain("[REDACTED]");
  });

  test("T-19: 닫히지 않은 private key 인용값의 PEM 본문도 제거합니다", () => {
    const redacted = redactSensitive(
      '{"private_key":"-----BEGIN PRIVATE KEY-----\\nsecret-body'
    );
    expect(redacted).not.toMatch(/PRIVATE KEY|secret-body/);
    expect(redacted).toContain("[REDACTED]");
  });

  test("T-19: 비인용 여러 줄 private key를 END marker까지 제거합니다", () => {
    const redacted = redactSensitive(
      "private_key=-----BEGIN PRIVATE KEY-----\nsecret-body\n-----END PRIVATE KEY----- trailing"
    );
    expect(redacted).not.toMatch(/PRIVATE KEY|secret-body/);
    expect(redacted).toContain("[REDACTED]");
    expect(redacted).toContain(" trailing");
  });

  test("T-19: END marker가 없는 비인용 private key는 문자열 끝까지 제거합니다", () => {
    const redacted = redactSensitive(
      "private_key=-----BEGIN PRIVATE KEY-----\nsecret-body"
    );
    expect(redacted).not.toMatch(/PRIVATE KEY|secret-body/);
    expect(redacted).toBe("[REDACTED]");
  });

  test("T-19: Authorization 뒤 100k 공백의 Basic 진단은 정제하지 않습니다", () => {
    const message = `Authorization${" ".repeat(100_000)}Basic public-value`;
    expect(redactSensitive(message)).toBe(message.slice(0, 300));
  });

  test("T-19: Authorization 뒤 100k 공백의 Bearer secret은 제거합니다", () => {
    const message = `Authorization${" ".repeat(100_000)}Bearer auth-secret`;
    const redacted = redactSensitive(message);
    expect(redacted).not.toContain("auth-secret");
    expect(redacted).toBe("[REDACTED]");
  });

  test("T-19: 닫히지 않은 인용값의 연속 backslash payload를 보존하지 않습니다", () => {
    const payload = `${"\\".repeat(40)}backslash-secret`;
    const redacted = redactSensitive(`{"private_key":"${payload}`);
    expect(redacted).not.toContain("backslash-secret");
    expect(redacted).not.toContain(payload);
    expect(redacted).toContain("[REDACTED]");
  });

  test("T-19: HTTP 200 error 필드도 저장 전에 정제합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const token = "token-super-secret";
    fixture.dependencies.gsc.authenticate = async () => token;
    fixture.dependencies.gsc.verifyProperty = async () => undefined;
    fixture.dependencies.gsc.inspect = async (_token, _property, url) => ({
      ...createIndexedOutcome(url),
      error: `Authorization Bearer ${token} client_secret=credential-secret`,
    });

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(0);

    const events = await readEvents(getAuditPaths(fixture.dataDir).events);
    const result = events.find((event) => event.type === "result");
    const content = JSON.stringify(result);
    expect(content).not.toContain(token);
    expect(content).not.toContain("credential-secret");
    expect(content).not.toMatch(/Authorization\s*Bearer/i);
    expect(content).toContain("[REDACTED]");
  });

  test("T-15: authenticate 오류는 기존 파일과 비밀값을 보존하지 않습니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const before = await prepareSentinelRunFiles(fixture);
    let appendCalls = 0;
    let authenticateCalls = 0;
    fixture.dependencies.gsc.authenticate = async () => {
      authenticateCalls += 1;
      throw new Error(
        'auth failed {"Authorization":"Bearer auth-secret","client_secret":"credential-secret","private_key":"private-secret\\nline"}'
      );
    };
    fixture.dependencies.eventStore.append = async () => {
      appendCalls += 1;
    };

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(1);

    const output = [...fixture.outputMessages, ...fixture.errors].join("\n");
    expect(output).not.toMatch(/auth-secret|credential-secret|private-secret/);
    expect(authenticateCalls).toBe(1);
    expect(fixture.gscCalls).toEqual([]);
    expect(appendCalls).toBe(0);
    expect(await snapshotFiles(fixture.dataDir)).toEqual(before);
  });

  test("T-18: invalid inventory는 인증 전에 파일 변경 없이 종료합니다", async () => {
    const fixture = await createRunFixture(["A"]);
    directories.push(fixture.dataDir);
    const paths = getAuditPaths(fixture.dataDir);
    await appendAttempts(fixture, 1, "2026-08-13T23:00:00.000Z");
    await writeSentinelSummary(fixture.dataDir);
    await writeFile(paths.inventory, '{"auditId":"invalid"}\n', "utf8");
    const before = await snapshotFiles(fixture.dataDir);

    await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(1);

    expect(fixture.gscCalls).toEqual([]);
    expect(await snapshotFiles(fixture.dataDir)).toEqual(before);
  });

  test.each([401, 403])(
    "T-15: inspect %i는 auth_error 저장 후 다음 URL 없이 중단합니다",
    async (status) => {
      const fixture = await createRunFixture(["A", "B"]);
      directories.push(fixture.dataDir);
      const inspectedUrls: string[] = [];
      fixture.dependencies.gsc.inspect = async (_token, _property, url) => {
        inspectedUrls.push(url);
        return { status, error: "access denied" };
      };

      await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(
        0
      );

      const events = await readEvents(getAuditPaths(fixture.dataDir).events);
      expect(inspectedUrls).toEqual([recipeUrl("A")]);
      expect(events.filter((event) => event.type === "result")).toEqual([
        expect.objectContaining({ outcome: "auth_error", status }),
      ]);
      expect(await loadSummary(fixture)).toMatchObject({
        completedUrls: 0,
        pendingUrls: 2,
        apiFailureCounts: { auth_error: 1 },
      });
    }
  );

  test.each(FAILED_APPEND_EVENT_TYPES)(
    "T-19: %s append 오류는 summary를 보존하고 token을 출력하지 않습니다",
    async (failedEventType) => {
      const fixture = await createRunFixture(["A"]);
      directories.push(fixture.dataDir);
      const token = "generic-exact-token";
      await writeSentinelSummary(fixture.dataDir);
      const summaryPath = getAuditPaths(fixture.dataDir).summary;
      const beforeSummary = await readFile(summaryPath);
      fixture.dependencies.gsc.authenticate = async () => token;
      fixture.dependencies.gsc.verifyProperty = async () => undefined;
      configureAppendFailure(fixture, failedEventType, token);

      await expect(runCommand(["--run"], fixture.dependencies)).resolves.toBe(
        1
      );

      expect(fixture.errors.join("\n")).not.toContain(token);
      expect(fixture.errors.join("\n")).toContain("[REDACTED]");
      expect(await readFile(summaryPath)).toEqual(beforeSummary);
    }
  );
});
