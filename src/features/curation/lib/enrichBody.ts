// 본문 마크다운에 자동으로 ingredients/steps/ad 슬롯을 삽입 + yt/img 순서 정렬.
// AI는 슬롯을 박지 않고 코드가 결정 — 환각 위험 X.
//
// 룰:
//  - 각 H2 (^## ) 직후에 [ingredients](recipe-data:ingredients/N) +
//    [steps](recipe-data:steps/N) 두 줄 삽입.
//  - 매 2개 H2마다 광고 1개 (recipe-data:ad).
//  - 각 H2 섹션 안에서 yt 링크가 img 링크보다 위에 오도록 정렬.

const YT_LINE_RE = /\[.*?\]\(https?:\/\/(?:www\.)?(?:youtu\.be|youtube\.com)[^\s)]*\)/;
const IMG_LINE_RE = /^\s*!\[.*?\]\(https?:\/\//;

// H2 섹션 단위로 split해서 각 섹션 안에서 yt를 img 위로 옮긴다.
const reorderYouTubeBeforeImage = (md: string): string => {
  const lines = md.split("\n");
  const sections: number[] = [0];
  for (let i = 1; i < lines.length; i++) {
    if (/^## (?!#)/.test(lines[i])) sections.push(i);
  }
  sections.push(lines.length);

  for (let s = 0; s < sections.length - 1; s++) {
    const start = sections[s];
    const end = sections[s + 1];
    let ytIdx = -1;
    let imgIdx = -1;
    for (let i = start; i < end; i++) {
      if (YT_LINE_RE.test(lines[i])) ytIdx = i;
      if (IMG_LINE_RE.test(lines[i])) imgIdx = i;
    }
    if (ytIdx !== -1 && imgIdx !== -1 && ytIdx > imgIdx) {
      [lines[ytIdx], lines[imgIdx]] = [lines[imgIdx], lines[ytIdx]];
    }
  }
  return lines.join("\n");
};

export const enrichBodyMarkdown = (md: string): string => {
  const reordered = reorderYouTubeBeforeImage(md);
  const lines = reordered.split("\n");
  const out: string[] = [];
  let h2Index = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    out.push(line);

    if (/^## (?!#)/.test(line)) {
      h2Index += 1;
      const next = lines[i + 1];
      if (next !== undefined && next !== "") out.push("");
      out.push(`[ingredients](recipe-data:ingredients/${h2Index})`);
      out.push("");
      out.push(`[steps](recipe-data:steps/${h2Index})`);
      out.push("");
    }
  }

  if (h2Index < 1) return out.join("\n");

  const enriched = out.join("\n");
  const sectionRegex = /(^|\n)(## (?!#)[^\n]*)/g;
  const sectionStarts: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = sectionRegex.exec(enriched))) {
    sectionStarts.push(m[1] === "\n" ? m.index + 1 : m.index);
  }

  const pieces: string[] = [];
  let prev = 0;
  sectionStarts.forEach((start, idx) => {
    pieces.push(enriched.slice(prev, start));
    if (idx > 0 && idx % 2 === 0) {
      pieces.push("\n[ad](recipe-data:ad)\n\n");
    }
    prev = start;
  });
  pieces.push(enriched.slice(prev));

  const lastIdx = sectionStarts.length - 1;
  if (lastIdx >= 0 && lastIdx % 2 === 1) {
    pieces.push("\n\n[ad](recipe-data:ad)\n");
  }

  return pieces.join("");
};
