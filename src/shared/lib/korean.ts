const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_RIEUL = 8;

const getJongseongIndex = (char: string): number | null => {
  const code = char.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_END) return null;
  return (code - HANGUL_BASE) % 28;
};

export const getEuroParticle = (word: string): "로" | "으로" => {
  if (!word) return "으로";
  const lastChar = word[word.length - 1];
  const jongseong = getJongseongIndex(lastChar);
  if (jongseong === null) return "으로";
  if (jongseong === 0 || jongseong === JONGSEONG_RIEUL) return "로";
  return "으로";
};
