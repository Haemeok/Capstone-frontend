import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { getQueueSnapshot } from "./getQueueSnapshot";

jest.mock("@/shared/lib/admin-guard", () => ({
  requireAdminAction: jest.fn().mockResolvedValue(undefined),
}));

describe("getQueueSnapshot — slug 추출", () => {
  let tmpDir: string;
  const originalEnv = process.env.BLOG_PUBLISH_QUEUE_DIR;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "queue-snapshot-test-"));
    fs.mkdirSync(path.join(tmpDir, "pending"), { recursive: true });
    process.env.BLOG_PUBLISH_QUEUE_DIR = tmpDir;
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalEnv === undefined) delete process.env.BLOG_PUBLISH_QUEUE_DIR;
    else process.env.BLOG_PUBLISH_QUEUE_DIR = originalEnv;
  });

  const makePackage = (name: string, meta?: object) => {
    const dir = path.join(tmpDir, "pending", name);
    fs.mkdirSync(dir, { recursive: true });
    if (meta !== undefined) {
      fs.writeFileSync(
        path.join(dir, "curation-meta.json"),
        JSON.stringify(meta)
      );
    }
  };

  it("curation-meta.json 의 slug 가 QueueItemSnapshot.slug 에 들어감", async () => {
    makePackage("curation-epigung-쌈채소-2026-05-27", {
      slug: "spring-salads",
    });
    const snap = await getQueueSnapshot();
    expect(snap.pending).toHaveLength(1);
    expect(snap.pending[0].slug).toBe("spring-salads");
  });

  it("curation-meta.json 없는 (recipe-prefix) 항목은 slug 가 undefined", async () => {
    makePackage("recipe-된장찌개-2026-05-27"); // meta 없음
    const snap = await getQueueSnapshot();
    expect(snap.pending[0].slug).toBeUndefined();
  });

  it("curation-meta.json 파싱 실패하면 slug 가 undefined (그러나 항목은 그대로 나옴)", async () => {
    const dir = path.join(tmpDir, "pending", "curation-broken-2026-05-27");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "curation-meta.json"), "not valid json");
    const snap = await getQueueSnapshot();
    expect(snap.pending).toHaveLength(1);
    expect(snap.pending[0].slug).toBeUndefined();
  });
});
