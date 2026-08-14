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
  InventorySchema,
  loadInventory,
  readEvents,
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

  test("T-03: 첫 미완료 URL 검사 결과를 이벤트와 요약에 반영합니다", async () => {
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
    expect(events.map(({ type }) => type)).toEqual(["attempt", "result"]);
    expect(events[0].attemptId).toBe(events[1].attemptId);
    expect(events[1]).toMatchObject({
      url: recipeUrl("A"),
      verdict: "PASS",
      pageFetchState: "SUCCESSFUL",
    });

    const summary = SummarySchema.parse(await loadJson(paths.summary));
    expect(summary).toMatchObject({
      totalUrls: 4,
      completedUrls: 1,
      pendingUrls: 3,
      indexed: 1,
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
    expect(summary).toMatchObject({ completedUrls: 1, pendingUrls: 3 });
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
});
