// 본문 마크다운에 자동으로 ingredients/steps/ad 슬롯을 삽입한다.
// AI는 슬롯을 박지 않고 코드가 결정 — 환각 위험 X.
//
// 룰:
//  - 각 H2 (^## ) 직후에 [ingredients](recipe-data:ingredients/N) +
//    [steps](recipe-data:steps/N) 두 줄 삽입 (N = H2 인덱스, 0-based).
//  - 매 2개 H2마다 광고 1개 (총 광고 수 = floor(H2 수 / 2)).
//    배치: 짝수 인덱스(2,4,...) H2 시작 직전에 한 개씩 박고,
//    마지막 H2 인덱스가 홀수(1,3,...)면 본문 끝에도 한 개 추가.
export const enrichBodyMarkdown = (md: string): string => {
  const lines = md.split("\n");
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
      pieces.push("\n[ad](in-article-ad)\n\n");
    }
    prev = start;
  });
  pieces.push(enriched.slice(prev));

  // 마지막 H2 인덱스가 홀수면 본문 끝에도 광고 (짝수 H2 묶음 마무리).
  const lastIdx = sectionStarts.length - 1;
  if (lastIdx >= 0 && lastIdx % 2 === 1) {
    pieces.push("\n\n[ad](in-article-ad)\n");
  }

  return pieces.join("");
};
