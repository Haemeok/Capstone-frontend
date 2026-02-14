import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const IV_LENGTH = 16;
const ALGORITHM = "aes-256-cbc";

const getEncryptionKey = (): Buffer => {
  const key = process.env.AUTH_SECRET_KEY;

  if (!key) {
    throw new Error("AUTH_SECRET_KEY 환경변수가 설정되지 않았습니다.");
  }

  if (key.length !== 32) {
    throw new Error("AUTH_SECRET_KEY는 정확히 32자여야 합니다.");
  }

  return Buffer.from(key);
};

/**
 * Set-Cookie 헤더 배열을 암호화
 * - AES-256-CBC 사용
 * - IV를 앞에 붙여서 반환: "iv:encryptedData"
 */
export const encryptTokenData = (cookies: string[]): string => {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(JSON.stringify(cookies), "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

/**
 * 암호화된 토큰 데이터를 복호화
 * - 복호화 실패 시 에러 throw
 */
export const decryptTokenData = (encryptedText: string): string[] => {
  const key = getEncryptionKey();

  const [ivHex, encryptedData] = encryptedText.split(":");

  if (!ivHex || !encryptedData) {
    throw new Error("잘못된 암호화 데이터 형식");
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};
