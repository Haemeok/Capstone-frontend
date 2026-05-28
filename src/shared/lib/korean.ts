const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_RIEUL = 8;

const getJongseongIndex = (char: string): number | null => {
  const code = char.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_END) return null;
  return (code - HANGUL_BASE) % 28;
};

const findLastHangulChar = (s: string): string | null => {
  for (let i = s.length - 1; i >= 0; i--) {
    if (getJongseongIndex(s[i]) !== null) return s[i];
  }
  return null;
};

export const getEuroParticle = (word: string): "로" | "으로" => {
  if (!word) return "으로";
  const lastChar = word[word.length - 1];
  const jongseong = getJongseongIndex(lastChar);
  if (jongseong === null) return "으로";
  if (jongseong === 0 || jongseong === JONGSEONG_RIEUL) return "로";
  return "으로";
};

export const getEulReulParticle = (word: string): "을" | "를" => {
  const lastHangul = word ? findLastHangulChar(word) : null;
  if (lastHangul === null) return "를";
  return getJongseongIndex(lastHangul) === 0 ? "를" : "을";
};

const EUL_REUL_PATTERN = /([가-힣A-Za-z0-9)\]]+)([을를])(?=[\s,.!?·…)\]]|$)/g;

export const normalizeEulReulInText = (text: string): string =>
  text.replace(EUL_REUL_PATTERN, (match, word: string) => {
    const lastHangul = findLastHangulChar(word);
    if (lastHangul === null) return match;
    return `${word}${getEulReulParticle(word)}`;
  });
