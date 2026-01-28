import {
  generateExchangeCode,
  retrieveAndDeleteToken,
  storeTokenForExchange,
} from "../tokenExchangeCache";

describe("tokenExchangeCache", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("generateExchangeCode", () => {
    it("32자 hex 문자열을 생성해야 함", () => {
      const code = generateExchangeCode();

      expect(code).toHaveLength(32);
      expect(code).toMatch(/^[a-f0-9]{32}$/);
    });

    it("매 호출마다 다른 코드를 생성해야 함", () => {
      const code1 = generateExchangeCode();
      const code2 = generateExchangeCode();

      expect(code1).not.toBe(code2);
    });
  });

  describe("storeTokenForExchange / retrieveAndDeleteToken", () => {
    const mockCookies = [
      "accessToken=abc123; Path=/; HttpOnly; Secure",
      "refreshToken=xyz789; Path=/; HttpOnly; Secure",
    ];

    it("저장 후 조회에 성공해야 함", () => {
      const code = "test-code-123";
      storeTokenForExchange(code, mockCookies);

      const result = retrieveAndDeleteToken(code);

      expect(result).toEqual(mockCookies);
    });

    it("일회성 사용: 두 번째 조회는 null을 반환해야 함", () => {
      const code = "test-code-456";
      storeTokenForExchange(code, mockCookies);

      const firstResult = retrieveAndDeleteToken(code);
      const secondResult = retrieveAndDeleteToken(code);

      expect(firstResult).toEqual(mockCookies);
      expect(secondResult).toBeNull();
    });

    it("존재하지 않는 코드는 null을 반환해야 함", () => {
      const result = retrieveAndDeleteToken("non-existent-code");

      expect(result).toBeNull();
    });

    it("만료 후 조회는 null을 반환해야 함", () => {
      const code = "test-code-expired";
      storeTokenForExchange(code, mockCookies);

      // 60초 + 1ms 경과
      jest.advanceTimersByTime(60001);

      const result = retrieveAndDeleteToken(code);

      expect(result).toBeNull();
    });

    it("만료 전에는 정상적으로 조회되어야 함", () => {
      const code = "test-code-not-expired";
      storeTokenForExchange(code, mockCookies);

      // 59초 경과 (만료 전)
      jest.advanceTimersByTime(59000);

      const result = retrieveAndDeleteToken(code);

      expect(result).toEqual(mockCookies);
    });

    it("새로운 항목 저장 시 만료된 항목이 정리되어야 함", () => {
      const code1 = "old-code";
      const code2 = "new-code";
      const cookies1 = ["cookie1=value1"];
      const cookies2 = ["cookie2=value2"];

      // 첫 번째 코드 저장
      storeTokenForExchange(code1, cookies1);

      // 61초 경과 (첫 번째 코드 만료)
      jest.advanceTimersByTime(61000);

      // 두 번째 코드 저장 (이 과정에서 만료된 항목 정리됨)
      storeTokenForExchange(code2, cookies2);

      // 첫 번째 코드는 만료로 인해 이미 null
      const result1 = retrieveAndDeleteToken(code1);
      // 두 번째 코드는 정상 조회
      const result2 = retrieveAndDeleteToken(code2);

      expect(result1).toBeNull();
      expect(result2).toEqual(cookies2);
    });
  });
});
