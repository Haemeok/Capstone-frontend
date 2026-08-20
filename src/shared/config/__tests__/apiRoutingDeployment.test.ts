import vercelConfig from "../../../../vercel.json";

describe("Vercel API routing deployment contract", () => {
  it("T-09: 정적 배포 설정은 일반 API reverse proxy를 추가하지 않는다", () => {
    const apiRewrite = vercelConfig.rewrites.find(({ source }) =>
      source.startsWith("/api/")
    );

    expect(apiRewrite).toBeUndefined();
    expect(vercelConfig.crons).toContainEqual({
      path: "/api/bff/cron/sync-index-bloom",
      schedule: "0 0 * * *",
    });
    expect(vercelConfig.rewrites).toContainEqual({
      source: "/ingest/:path*",
      destination: "https://us.i.posthog.com/:path*",
    });
  });
});
