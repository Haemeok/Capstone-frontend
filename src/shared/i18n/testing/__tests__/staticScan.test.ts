import { findKoreanLeaks } from "../staticScan";

const withDict = (body: string) =>
  `import { useT } from "@/shared/i18n";\n${body}`;

describe("findKoreanLeaks (가드 A 스캐너)", () => {
  it("T-01: 사전 import + 한국어 JSX 텍스트 -> 위반 1", () => {
    const v = findKoreanLeaks(
      withDict(`const C = () => <button>저장</button>;`)
    );
    expect(v).toHaveLength(1);
    expect(v[0].text).toContain("저장");
  });

  it("T-01b: 사전 import + substitution 템플릿 한국어 -> 위반 1", () => {
    const v = findKoreanLeaks(
      withDict("const C = (x: string) => `저장 ${x}`;")
    );
    expect(v).toHaveLength(1);
    expect(v[0].text).toContain("저장");
  });

  it("T-02: 사전 미import + 한국어 -> 위반 0", () => {
    const v = findKoreanLeaks(`const C = () => <button>저장</button>;`);
    expect(v).toHaveLength(0);
  });

  it("T-03: i18n-ignore 라인 -> 위반 0", () => {
    const v = findKoreanLeaks(
      withDict(`const brand = "레시피오"; // i18n-ignore: 브랜드명`)
    );
    expect(v).toHaveLength(0);
  });

  it("T-04: 한국어가 주석에만 -> 위반 0", () => {
    const v = findKoreanLeaks(withDict(`// 저장 버튼\nconst x = 1;`));
    expect(v).toHaveLength(0);
  });

  it("T-05: 한국어 JSX 속성 문자열 -> 위반 1", () => {
    const v = findKoreanLeaks(
      withDict(`const C = () => <input placeholder="이름" />;`)
    );
    expect(v).toHaveLength(1);
    expect(v[0].text).toContain("이름");
  });
});
