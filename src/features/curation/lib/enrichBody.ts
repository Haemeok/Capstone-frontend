import { normalizeEulReulInText } from "@/shared/lib/korean";

// 본문 마크다운을 H2 섹션 단위로 재조립해 결정적 슬롯 순서를 강제한다.
// AI 출력은 슬롯 위치가 자주 어긋나기 때문에, 코드 단계에서 ingredients/steps를
// 자동으로 채우면서 동시에 yt/recipe/img 위치도 정규화한다.
//
// 각 H2 섹션의 최종 순서:
//   1) ## 제목
//   2) yt 링크 (있으면)
//   3) 설명 단락(들) — 인라인에 박힌 recipe 링크는 분리 추출
//   4) [ingredients](#cur:ingredients/N)
//   5) [steps](#cur:steps/N)
//   6) recipe 링크 ([... →](/recipes/...))
//   7) img (![...](https://...))
//
// 또한 매 H2 섹션(레시피 1개) 직후마다 인아티클 광고 슬롯 1개 삽입.

const YT_LINE_RE =
  /^\s*\[[^\]]*?\]\(https?:\/\/(?:www\.)?(?:youtu\.be|youtube\.com)[^\s)]*\)\s*$/;
const IMG_LINE_RE = /^\s*!\[[^\]]*?\]\(https?:\/\//;
const RECIPE_LINK_RE = /\[[^\]]+\]\(\/recipes\/[^)]+\)/g;
const H2_RE = /^## (?!#)/;
// 모델이 본문 구조를 잘못 박아 첫 H2를 "## 인트로"로 만들어버리는 케이스가 있음.
// 그러면 진짜 인트로 단락이 첫 레시피 섹션으로 빨려 들어가 ingredients/steps 슬롯이
// 엉뚱한 곳에 붙음. 헤더 라인만 통째로 떼면 아래 단락은 자연스럽게 인트로로 흡수됨.
const INTRO_HEADER_RE = /^##\s+(?:인트로|도입|intro)\s*$/i;

type ParsedSection = {
  headerLine: string;
  ytParas: string[];
  descParas: string[];
  recipeLinks: string[];
  imgParas: string[];
};

const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

const extractRecipeLinksInline = (
  paragraph: string,
): { stripped: string; links: string[] } => {
  const links: string[] = [];
  RECIPE_LINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = RECIPE_LINK_RE.exec(paragraph))) links.push(m[0]);

  if (links.length === 0) return { stripped: paragraph, links: [] };

  // recipe 링크를 잘라낸 자리를 정리: 연속 공백 한 칸으로, 구두점 앞 잉여 공백 제거.
  const stripped = paragraph
    .replace(RECIPE_LINK_RE, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?,])/g, "$1")
    .trim();

  return { stripped, links };
};

const parseSection = (headerLine: string, bodyText: string): ParsedSection => {
  const paragraphs = splitParagraphs(bodyText);
  const ytParas: string[] = [];
  const imgParas: string[] = [];
  const recipeLinks: string[] = [];
  const descParas: string[] = [];

  for (const p of paragraphs) {
    if (YT_LINE_RE.test(p)) {
      ytParas.push(p);
      continue;
    }
    if (IMG_LINE_RE.test(p)) {
      imgParas.push(p);
      continue;
    }
    // recipe 링크가 standalone이거나 인라인으로 박혀 있을 수 있으므로 둘 다 추출.
    const { stripped, links } = extractRecipeLinksInline(p);
    if (links.length > 0) recipeLinks.push(...links);
    if (stripped.length > 0) descParas.push(stripped);
  }

  return { headerLine, ytParas, descParas, recipeLinks, imgParas };
};

const renderSection = (section: ParsedSection, h2Index: number): string => {
  const parts: string[] = [section.headerLine];
  if (section.ytParas.length > 0) parts.push(...section.ytParas);
  if (section.descParas.length > 0) parts.push(...section.descParas);
  parts.push(`[ingredients](#cur:ingredients/${h2Index})`);
  parts.push(`[steps](#cur:steps/${h2Index})`);
  if (section.recipeLinks.length > 0) parts.push(...section.recipeLinks);
  if (section.imgParas.length > 0) parts.push(...section.imgParas);
  return parts.join("\n\n");
};

export const enrichBodyMarkdown = (md: string): string => {
  // AI가 `** 굵게 **` 처럼 공백 섞어서 출력하면 markdown 파서가 bold로 못 잡고
  // 별표가 그대로 노출됨. 본문에서 `**` 한 쌍을 통째로 떼어 텍스트만 남긴다.
  const cleaned = md.replace(/\*\*/g, "");
  const lines = cleaned
    .split("\n")
    .filter((l) => !INTRO_HEADER_RE.test(l));

  // H2 헤더 라인 인덱스 모음.
  const headerIdxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (H2_RE.test(lines[i])) headerIdxs.push(i);
  }

  if (headerIdxs.length === 0) return md;

  const intro = lines.slice(0, headerIdxs[0]).join("\n").trimEnd();

  const out: string[] = [];
  if (intro.trim().length > 0) out.push(intro);

  // 광고 슬롯에는 0-based 인덱스를 부여해 렌더 시 unique data-ad-slot을 고른다.
  let adIndex = 0;
  for (let s = 0; s < headerIdxs.length; s++) {
    const start = headerIdxs[s];
    const end = s + 1 < headerIdxs.length ? headerIdxs[s + 1] : lines.length;
    const headerLine = lines[start];
    const bodyText = lines.slice(start + 1, end).join("\n");

    const parsed = parseSection(headerLine, bodyText);
    out.push(renderSection(parsed, s));

    out.push(`[ad](#cur:ad/${adIndex})`);
    adIndex += 1;
  }

  return normalizeEulReulInText(out.join("\n\n"));
};
