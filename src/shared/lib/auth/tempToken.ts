const INTERNAL_API_URL = "https://api.recipio.kr/api/internal/auth/temp-token";

const getInternalApiKey = (): string => {
  const key = process.env.INTERNAL_API_KEY;

  if (!key) {
    throw new Error("INTERNAL_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  return key;
};

/**
 * Set-Cookie 헤더 배열을 백엔드 Redis에 임시 저장하고 UUID를 반환
 * - TTL: 5분, 1회용
 */
export const storeTempToken = async (cookies: string[]): Promise<string> => {
  const res = await fetch(INTERNAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": getInternalApiKey(),
    },
    body: JSON.stringify({ cookies }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "unknown");
    throw new Error(`Failed to store temp token: ${res.status} ${errorBody}`);
  }

  const data = await res.json();
  return data.token;
};

/**
 * UUID로 백엔드 Redis에서 Set-Cookie 헤더 배열을 조회 (1회용, 조회 후 삭제)
 */
export const retrieveTempToken = async (token: string): Promise<string[]> => {
  const res = await fetch(`${INTERNAL_API_URL}/${token}`, {
    headers: {
      "X-Internal-Key": getInternalApiKey(),
    },
  });

  if (!res.ok) {
    throw new Error(`Temp token not found or expired: ${res.status}`);
  }

  const data = await res.json();
  return data.cookies;
};
