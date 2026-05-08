import { enrichBodyMarkdown } from "./enrichBody";

const baseBody = `인트로 한 단락.

## 첫 레시피 제목

본문 단락. 추천 [요리-a →](/recipes/a)

[▶ 영상](https://youtu.be/aaa)

## 둘째 레시피 제목

본문. [요리-b →](/recipes/b)

[▶ 영상](https://youtu.be/bbb)

## 셋째 레시피 제목

본문 셋째.

결말 단락.`;

describe("enrichBodyMarkdown", () => {
  it("각 H2에 ingredients/steps 슬롯 라인이 인덱스 순서대로 들어간다", () => {
    const out = enrichBodyMarkdown(baseBody);
    expect(out).toContain("[ingredients](#cur:ingredients/0)");
    expect(out).toContain("[steps](#cur:steps/0)");
    expect(out).toContain("[ingredients](#cur:ingredients/1)");
    expect(out).toContain("[steps](#cur:steps/2)");
  });

  it("각 H2 직후마다 광고 1개 (H2 셋이면 광고 3개)", () => {
    const out = enrichBodyMarkdown(baseBody);
    const ads = out.match(/\[ad\]\(#cur:ad\/\d+\)/g) ?? [];
    expect(ads).toEqual([
      "[ad](#cur:ad/0)",
      "[ad](#cur:ad/1)",
      "[ad](#cur:ad/2)",
    ]);
  });

  it("H2가 없으면 원문 그대로 반환", () => {
    const md = "단락 1.\n\n단락 2.";
    expect(enrichBodyMarkdown(md)).toBe(md);
  });

  it("H2가 4개면 광고 4개, 각 광고는 0~3 인덱스로 unique", () => {
    const md = ["인트로.", "## A", "x", "## B", "x", "## C", "x", "## D", "x"].join("\n\n");
    const out = enrichBodyMarkdown(md);
    const ads = out.match(/\[ad\]\(#cur:ad\/\d+\)/g) ?? [];
    expect(ads).toEqual([
      "[ad](#cur:ad/0)",
      "[ad](#cur:ad/1)",
      "[ad](#cur:ad/2)",
      "[ad](#cur:ad/3)",
    ]);
  });

  it("각 H2 섹션 안 슬롯 순서: yt → desc → ingredients → steps → recipe-link → img", () => {
    const md = `## 한 레시피

[▶ 영상](https://youtu.be/abc)

본문 설명 단락 한 줄.

[전체 레시피 →](/recipes/r1)

![대표 이미지](https://example.com/x.jpg)`;

    const out = enrichBodyMarkdown(md);
    const yt = out.indexOf("[▶ 영상](https://youtu.be/abc)");
    const desc = out.indexOf("본문 설명 단락 한 줄.");
    const ing = out.indexOf("[ingredients](#cur:ingredients/0)");
    const steps = out.indexOf("[steps](#cur:steps/0)");
    const recipe = out.indexOf("[전체 레시피 →](/recipes/r1)");
    const img = out.indexOf("![대표 이미지]");
    expect(yt).toBeGreaterThan(-1);
    expect(yt).toBeLessThan(desc);
    expect(desc).toBeLessThan(ing);
    expect(ing).toBeLessThan(steps);
    expect(steps).toBeLessThan(recipe);
    expect(recipe).toBeLessThan(img);
  });

  it("yt가 본문 마지막 단락에 박혀도 desc 위로 끌어 올린다", () => {
    const md = `## 레시피

본문 단락.

[전체 레시피 →](/recipes/r1)

![이미지](https://x.jpg)

[▶ 영상 보기](https://youtu.be/zzz)`;

    const out = enrichBodyMarkdown(md);
    const yt = out.indexOf("[▶ 영상 보기]");
    const desc = out.indexOf("본문 단락.");
    const img = out.indexOf("![이미지]");
    expect(yt).toBeLessThan(desc);
    expect(desc).toBeLessThan(img);
  });

  it("recipe 링크가 인라인 단락에 박혀있으면 분리 추출하고 본문 텍스트는 보존", () => {
    const md = `## 레시피

본문 단락. 추천 [요리 →](/recipes/aaa) 해요.

![이미지](https://x.jpg)`;
    const out = enrichBodyMarkdown(md);
    expect(out).toContain("[요리 →](/recipes/aaa)");
    // 본문에서 링크 자국 없이 "본문 단락. 추천 해요." 같은 형태로 정리.
    expect(out).toMatch(/본문 단락\. 추천 해요\./);
    // 분리된 recipe 링크는 ingredients/steps 슬롯 다음에 위치.
    const steps = out.indexOf("[steps](#cur:steps/0)");
    const recipe = out.indexOf("[요리 →](/recipes/aaa)");
    expect(recipe).toBeGreaterThan(steps);
  });

  it("recipe 링크가 standalone 단락이어도 정상 추출", () => {
    const md = `## 레시피

설명 단락.

[전체 레시피 →](/recipes/abc)

![이미지](https://x.jpg)`;
    const out = enrichBodyMarkdown(md);
    expect(out).toContain("[전체 레시피 →](/recipes/abc)");
    const steps = out.indexOf("[steps](#cur:steps/0)");
    const recipe = out.indexOf("[전체 레시피 →](/recipes/abc)");
    const img = out.indexOf("![이미지]");
    expect(recipe).toBeGreaterThan(steps);
    expect(recipe).toBeLessThan(img);
  });

  it("AI가 슬롯을 누락해도 enrich은 ingredients/steps만 자동 채운다", () => {
    const md = `## 레시피

설명만 있고 슬롯 없음.`;
    const out = enrichBodyMarkdown(md);
    expect(out).toContain("[ingredients](#cur:ingredients/0)");
    expect(out).toContain("[steps](#cur:steps/0)");
    expect(out).toContain("설명만 있고 슬롯 없음.");
  });

  it("인트로 단락은 H2 위에 그대로 보존", () => {
    const out = enrichBodyMarkdown(baseBody);
    const intro = out.indexOf("인트로 한 단락.");
    const firstH2 = out.indexOf("## 첫 레시피 제목");
    expect(intro).toBeGreaterThan(-1);
    expect(intro).toBeLessThan(firstH2);
  });

  it('"## 인트로" 헤더가 박혀 있으면 라인을 떼고 아래 단락은 인트로로 흡수', () => {
    const md = `## 인트로

진짜 도입 단락 한 줄.

## 첫 레시피

본문.`;
    const out = enrichBodyMarkdown(md);
    expect(out).not.toContain("## 인트로");
    const intro = out.indexOf("진짜 도입 단락 한 줄.");
    const firstH2 = out.indexOf("## 첫 레시피");
    expect(intro).toBeGreaterThan(-1);
    expect(intro).toBeLessThan(firstH2);
    // 인트로 단락에는 ingredients 슬롯이 안 붙어야 함 (slot/0 은 첫 레시피 몫).
    expect(out).not.toMatch(/진짜 도입 단락[\s\S]*\[ingredients\]\(#cur:ingredients\/0\)[\s\S]*## 첫 레시피/);
  });

  it('"## intro"/"## Intro"/"## 도입" 변형도 제거', () => {
    for (const header of ["## intro", "## Intro", "## INTRO", "## 도입"]) {
      const md = `${header}\n\n도입 단락.\n\n## 첫 레시피\n\n본문.`;
      const out = enrichBodyMarkdown(md);
      expect(out).not.toContain(header);
      expect(out).toContain("도입 단락.");
    }
  });

  it('"## 인트로 한 줄" 처럼 인트로 외 텍스트가 붙으면 제거하지 않음', () => {
    const md = `## 인트로 한 줄\n\n본문.\n\n## 첫 레시피\n\n본문.`;
    const out = enrichBodyMarkdown(md);
    expect(out).toContain("## 인트로 한 줄");
  });

  it("'## 어떻게 고를까' 류 ref 단락의 조사 오류도 normalizer로 교정", () => {
    const md = `## 첫 레시피

본문.

## 어떻게 고를까

상큼한 메뉴는 폰즈을, 든든한 한 끼는 어리굴젓를 추천한다.`;
    const out = enrichBodyMarkdown(md);
    expect(out).toContain("폰즈를");
    expect(out).toContain("어리굴젓을");
    expect(out).not.toContain("폰즈을");
    expect(out).not.toContain("어리굴젓를");
  });
});
