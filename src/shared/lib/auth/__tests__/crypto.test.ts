/**
 * @jest-environment node
 */

describe("crypto", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.AUTH_SECRET_KEY = "12345678901234567890123456789012"; // 32자
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe("encryptTokenData / decryptTokenData", () => {
    it("암호화 후 복호화하면 원본 데이터가 복원되어야 함", async () => {
      const { encryptTokenData, decryptTokenData } = await import("../crypto");

      const cookies = [
        "accessToken=abc123; Path=/; HttpOnly; Secure",
        "refreshToken=xyz789; Path=/; HttpOnly; Secure",
      ];

      const encrypted = encryptTokenData(cookies);
      const decrypted = decryptTokenData(encrypted);

      expect(decrypted).toEqual(cookies);
    });

    it("암호화된 데이터는 iv:encryptedData 형식이어야 함", async () => {
      const { encryptTokenData } = await import("../crypto");

      const cookies = ["test=value"];
      const encrypted = encryptTokenData(cookies);

      expect(encrypted).toContain(":");
      const [iv, data] = encrypted.split(":");
      expect(iv).toHaveLength(32); // 16바이트 hex = 32자
      expect(data.length).toBeGreaterThan(0);
    });

    it("같은 데이터를 암호화해도 IV가 달라서 결과가 다름", async () => {
      const { encryptTokenData } = await import("../crypto");

      const cookies = ["test=value"];
      const encrypted1 = encryptTokenData(cookies);
      const encrypted2 = encryptTokenData(cookies);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it("잘못된 형식의 데이터는 복호화 실패", async () => {
      const { decryptTokenData } = await import("../crypto");

      expect(() => decryptTokenData("invalid-data")).toThrow();
    });

    it("변조된 데이터는 복호화 실패", async () => {
      const { encryptTokenData, decryptTokenData } = await import("../crypto");

      const cookies = ["test=value"];
      const encrypted = encryptTokenData(cookies);

      // 데이터 변조
      const tampered = encrypted.replace(/[a-f]/g, "0");

      expect(() => decryptTokenData(tampered)).toThrow();
    });
  });

  describe("환경변수 검증", () => {
    it("AUTH_SECRET_KEY가 없으면 에러", async () => {
      delete process.env.AUTH_SECRET_KEY;
      jest.resetModules();

      const { encryptTokenData } = await import("../crypto");

      expect(() => encryptTokenData(["test"])).toThrow(
        "AUTH_SECRET_KEY 환경변수가 설정되지 않았습니다"
      );
    });

    it("AUTH_SECRET_KEY가 32자가 아니면 에러", async () => {
      process.env.AUTH_SECRET_KEY = "short-key";
      jest.resetModules();

      const { encryptTokenData } = await import("../crypto");

      expect(() => encryptTokenData(["test"])).toThrow(
        "AUTH_SECRET_KEY는 정확히 32자여야 합니다"
      );
    });
  });
});
