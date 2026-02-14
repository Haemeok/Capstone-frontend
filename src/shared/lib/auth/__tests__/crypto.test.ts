/**
 * @jest-environment node
 */
import { decryptTokenData, encryptTokenData } from "../crypto";

describe("Token Encryption", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      AUTH_SECRET_KEY: "02b7737fee222c98e996d5c8429f0dc8",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  const mockCookies = [
    "accessToken=abc123; Path=/; HttpOnly; Secure",
    "refreshToken=xyz789; Path=/; HttpOnly; Secure",
  ];

  describe("encryptTokenData", () => {
    it("쿠키 배열을 암호화된 문자열로 반환해야 함", () => {
      const encrypted = encryptTokenData(mockCookies);

      expect(typeof encrypted).toBe("string");
      expect(encrypted).toContain(":");
      expect(encrypted).not.toContain("accessToken");
    });

    it("매번 다른 암호문을 생성해야 함 (IV가 랜덤)", () => {
      const encrypted1 = encryptTokenData(mockCookies);
      const encrypted2 = encryptTokenData(mockCookies);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe("decryptTokenData", () => {
    it("암호화된 데이터를 올바르게 복호화해야 함", () => {
      const encrypted = encryptTokenData(mockCookies);
      const decrypted = decryptTokenData(encrypted);

      expect(decrypted).toEqual(mockCookies);
    });

    it("잘못된 형식의 데이터에서 에러를 throw해야 함", () => {
      expect(() => decryptTokenData("invalid-data")).toThrow(
        "잘못된 암호화 데이터 형식"
      );
    });

    it("변조된 데이터에서 에러를 throw해야 함", () => {
      const encrypted = encryptTokenData(mockCookies);
      const tampered = encrypted.slice(0, -4) + "0000";

      expect(() => decryptTokenData(tampered)).toThrow();
    });
  });

  describe("환경변수 검증", () => {
    it("AUTH_SECRET_KEY가 없으면 에러를 throw해야 함", () => {
      delete process.env.AUTH_SECRET_KEY;

      expect(() => encryptTokenData(mockCookies)).toThrow(
        "AUTH_SECRET_KEY 환경변수가 설정되지 않았습니다."
      );
    });

    it("AUTH_SECRET_KEY가 32자가 아니면 에러를 throw해야 함", () => {
      process.env.AUTH_SECRET_KEY = "short-key";

      expect(() => encryptTokenData(mockCookies)).toThrow(
        "AUTH_SECRET_KEY는 정확히 32자여야 합니다."
      );
    });
  });
});
