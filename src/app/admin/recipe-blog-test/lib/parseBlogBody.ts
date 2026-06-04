export type ParsedBlogBody = {
  intro: string;
  sections: Array<{
    headingText: string;
    body: string;
  }>;
  outro: string;
};

export type ParseBlogBodyResult =
  | { ok: true; parsed: ParsedBlogBody }
  | { ok: false; errors: string[] };

const HR_RE = /^(?:---+|\*\*\*+)$/;
const H2_RE = /^##\s+(.+)$/;

export const parseBlogBody = (
  markdown: string,
  expectedSectionCount: number
): ParseBlogBodyResult => {
  const lines = markdown.split(/\r?\n/);
  const headingIndices: number[] = [];

  lines.forEach((line, i) => {
    if (H2_RE.test(line.trim())) headingIndices.push(i);
  });

  if (headingIndices.length === 0) {
    return { ok: false, errors: ["## 헤딩을 하나도 찾지 못함"] };
  }
  if (headingIndices.length !== expectedSectionCount) {
    return {
      ok: false,
      errors: [
        `## 헤딩 개수 ${headingIndices.length} ≠ 기대값 ${expectedSectionCount}`,
      ],
    };
  }

  const lastHeading = headingIndices[headingIndices.length - 1];
  let outroStart = -1;
  for (let i = lastHeading + 1; i < lines.length; i++) {
    if (HR_RE.test(lines[i].trim())) {
      outroStart = i + 1;
      break;
    }
  }
  if (outroStart < 0) {
    return {
      ok: false,
      errors: ["닫는 단락 시작 마커(`---` 또는 `***`)를 찾지 못함"],
    };
  }

  const intro = lines.slice(0, headingIndices[0]).join("\n").trim();

  const sections = headingIndices.map((idx, i) => {
    const headingMatch = lines[idx].trim().match(H2_RE);
    const headingText = headingMatch ? headingMatch[1].trim() : "";
    const start = idx + 1;
    const end =
      i < headingIndices.length - 1 ? headingIndices[i + 1] : outroStart - 1;
    const body = lines
      .slice(start, end)
      .filter((l) => !HR_RE.test(l.trim()))
      .join("\n")
      .trim();
    return { headingText, body };
  });

  const outro = lines.slice(outroStart).join("\n").trim();

  return { ok: true, parsed: { intro, sections, outro } };
};
