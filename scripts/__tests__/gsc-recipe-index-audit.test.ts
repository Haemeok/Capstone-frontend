/** @jest-environment node */

import { existsSync } from "fs";
import { mkdtemp, readFile, rm, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

import {
  type AuditDependencies,
  type RunAuditCommand,
  runAuditCommand,
} from "../lib/gsc-index-audit";
import {
  appendEvent,
  AuditEventSchema,
  getAuditPaths,
  type Inventory,
  InventorySchema,
  loadInventory,
  readEvents,
  type Summary,
  SummarySchema,
} from "../lib/gsc-index-audit-store";

type AuditFixture = {
  dependencies: AuditDependencies;
  dataDir: string;
  errors: string[];
  gscCalls: string[];
  outputMessages: string[];
  sitemapCalls: number[];
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
  let id = 0;

  return {
    dataDir,
    errors,
    gscCalls,
    outputMessages,
    sitemapCalls,
    dependencies: {
      dataDir,
      clock: {
        now: () => new Date("2026-08-14T00:00:00.000Z"),
        sleep: async () => undefined,
        random: () => 0,
      },
      output: {
        stdout: (message) => outputMessages.push(message),
        stderr: (message) => errors.push(message),
      },
      sitemap: createSitemapGateway(sitemaps, sitemapCalls),
      gsc: createGscGateway(gscCalls),
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
    "T-01: %s 입력이면 inventory를 만들지 않습니다",
    async (_label, sitemaps) => {
      const fixture = await createFixture(sitemaps);
      directories.push(fixture.dataDir);

      await expect(runCommand(["--init"], fixture.dependencies)).resolves.toBe(
        1
      );

      expect(fixture.errors).not.toEqual([]);
      expect(existsSync(getAuditPaths(fixture.dataDir).inventory)).toBe(false);
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
});
