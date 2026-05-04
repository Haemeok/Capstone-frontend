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

// 받침 있으면 "을", 없으면 "를". ㄹ 받침은 "을" (받침 있음으로 처리).
// 단어 끝에 영문/괄호 같은 비-한글이 있어도 마지막 한글 음절까지 거슬러 올라가
// 그 받침으로 판정 — 사람이 "홀리키(Holi.ky)" 를 발음할 때 "키" 기준으로 조사를
// 고르는 방식과 일치. 한글이 하나도 없으면 안전을 위해 "를" fallback.
export const getEulReulParticle = (word: string): "을" | "를" => {
  const lastHangul = word ? findLastHangulChar(word) : null;
  if (lastHangul === null) return "를";
  return getJongseongIndex(lastHangul) === 0 ? "를" : "을";
};

// 단어 + 을/를 + (구두점·공백·끝) 패턴을 본문 전체에서 찾아 받침 기반으로 정규화.
// LLM이 외래어/일본어/괄호로 끝나는 단어 뒤에 조사를 잘못 박는 케이스 ("폰즈을",
// "소스을") 를 잡는 게 주 목적. 한글이 하나도 없는 단어 (예: 영문만) 는 발음을
// 모르므로 건드리지 않는다. 이미 맞게 박힌 케이스는 자기교정이 동일 결과라 무해.
const EUL_REUL_PATTERN = /([가-힣A-Za-z0-9)\]]+)([을를])(?=[\s,.!?·…)\]]|$)/g;

export const normalizeEulReulInText = (text: string): string =>
  text.replace(EUL_REUL_PATTERN, (match, word: string) => {
    const lastHangul = findLastHangulChar(word);
    if (lastHangul === null) return match;
    return `${word}${getEulReulParticle(word)}`;
  });
