import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { enqueueCurationBlogPostForPublish } from "./blogPublishQueue";

jest.mock("@/shared/lib/admin-guard", () => ({
  requireAdminAction: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/app/admin/recipe-blog-test/lib/blogToneAssignment", () => ({
  blogIdForTone: () => null,
}));

describe("enqueueCurationBlogPostForPublish — dup guard", () => {
  let tmpDir: string;
  const originalEnv = process.env.BLOG_PUBLISH_QUEUE_DIR;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "enqueue-dup-test-"));
    fs.mkdirSync(path.join(tmpDir, "pending"), { recursive: true });
    process.env.BLOG_PUBLISH_QUEUE_DIR = tmpDir;
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalEnv === undefined) delete process.env.BLOG_PUBLISH_QUEUE_DIR;
    else process.env.BLOG_PUBLISH_QUEUE_DIR = originalEnv;
  });

  it("같은 slug 가 pending 에 이미 있으면 error 반환", async () => {
    // 기존 큐 아이템 (slug=spring-salads)
    const existing = path.join(
      tmpDir,
      "pending",
      "curation-epigung-기존-2026-05-27"
    );
    fs.mkdirSync(existing, { recursive: true });
    fs.writeFileSync(
      path.join(existing, "curation-meta.json"),
      JSON.stringify({ slug: "spring-salads", recipeIds: [], tone: "epigung" })
    );

    const res = await enqueueCurationBlogPostForPublish({
      post: { intro: "", sections: [], outro: "" } as never,
      tone: "epigung",
      curationTitle: "재시도",
      imageUrlsBySlot: {},
      curationMeta: {
        slug: "spring-salads",
        recipeIds: [],
        brandLink: { text: "", url: "" },
      },
      recipes: [],
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain("이미 큐에 있어요");
      expect(res.error).toContain("spring-salads");
    }
    // 새 패키지 디렉터리가 안 만들어졌는지 확인
    const after = fs.readdirSync(path.join(tmpDir, "pending"));
    expect(after).toHaveLength(1); // 기존 1개만
  });

  it("dup 없으면 새 pending 패키지 생성 + success", async () => {
    const res = await enqueueCurationBlogPostForPublish({
      post: { intro: "", sections: [], outro: "" } as never,
      tone: "epigung",
      curationTitle: "신규 큐레이션",
      imageUrlsBySlot: {},
      curationMeta: {
        slug: "fresh-slug",
        recipeIds: [],
        brandLink: { text: "", url: "" },
      },
      recipes: [],
    });

    expect(res.success).toBe(true);
    const entries = fs.readdirSync(path.join(tmpDir, "pending"));
    expect(entries).toHaveLength(1);
    const created = entries[0];
    expect(created.startsWith("curation-epigung-")).toBe(true);
    const metaPath = path.join(
      tmpDir,
      "pending",
      created,
      "curation-meta.json"
    );
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    expect(meta.slug).toBe("fresh-slug");
    expect(meta.tone).toBe("epigung");
  });
});
