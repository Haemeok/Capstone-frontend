import { readFileSync } from "fs";
import { join } from "path";

const readProjectFile = (path: string) =>
  readFileSync(join(process.cwd(), path), "utf8");

describe("agent API routing guidance", () => {
  it("T-10: API 가이드는 환경별 cookie와 BFF routing 경계를 안내한다", () => {
    const guide = readProjectFile("AGENTS.md");

    expect(guide).toContain("VERCEL_ENV=production");
    expect(guide).toContain("SameSite=Lax");
    expect(guide).toContain("next.config.ts");
    expect(guide).toContain("vercel.json");
    expect(guide).toContain("인증 BFF");
    expect(guide).toContain("캐시 무효화 BFF");
  });

  it("T-10: WebView skill은 cookie site 기반 API routing 규칙을 노출한다", () => {
    const skill = readProjectFile(
      ".agents/skills/webview-integration/SKILL.md"
    );

    expect(skill).toContain("cookie-api-routing-by-site");
    expect(skill).toContain("rules/cookie-api-routing-by-site.md");
  });
});
