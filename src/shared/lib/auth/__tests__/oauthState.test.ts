import { createOAuthState, parseOAuthState } from "../oauthState";

describe("oauthState", () => {
  describe("createOAuthState", () => {
    it("웹 플랫폼: csrfToken만 포함된 state를 생성해야 함", () => {
      const result = createOAuthState();

      expect(result.state).toBe(result.csrfToken);
      expect(result.state).not.toContain(":");
    });

    it("앱 플랫폼: csrfToken:app 형식의 state를 생성해야 함", () => {
      const result = createOAuthState("app");

      expect(result.state).toBe(`${result.csrfToken}:app`);
      expect(result.state).toContain(":app");
    });

    it("csrfToken은 32자 hex 문자열이어야 함", () => {
      const result = createOAuthState();

      expect(result.csrfToken).toHaveLength(32);
      expect(result.csrfToken).toMatch(/^[a-f0-9]{32}$/);
    });

    it("매 호출마다 다른 csrfToken을 생성해야 함", () => {
      const result1 = createOAuthState();
      const result2 = createOAuthState();

      expect(result1.csrfToken).not.toBe(result2.csrfToken);
    });

    it("app이 아닌 다른 platform 값은 웹으로 처리해야 함", () => {
      const result = createOAuthState("web");

      expect(result.state).toBe(result.csrfToken);
      expect(result.state).not.toContain(":");
    });
  });

  describe("parseOAuthState", () => {
    it("null 입력 시 빈 csrfToken과 isApp: false를 반환해야 함", () => {
      const result = parseOAuthState(null);

      expect(result.csrfToken).toBe("");
      expect(result.isApp).toBe(false);
    });

    it("빈 문자열 입력 시 빈 csrfToken과 isApp: false를 반환해야 함", () => {
      const result = parseOAuthState("");

      expect(result.csrfToken).toBe("");
      expect(result.isApp).toBe(false);
    });

    it("웹 state(csrfToken만)를 올바르게 파싱해야 함", () => {
      const csrfToken = "abc123def456789012345678901234ab";
      const result = parseOAuthState(csrfToken);

      expect(result.csrfToken).toBe(csrfToken);
      expect(result.isApp).toBe(false);
    });

    it("앱 state(csrfToken:app)를 올바르게 파싱해야 함", () => {
      const csrfToken = "abc123def456789012345678901234ab";
      const state = `${csrfToken}:app`;
      const result = parseOAuthState(state);

      expect(result.csrfToken).toBe(csrfToken);
      expect(result.isApp).toBe(true);
    });

    it("잘못된 형식(csrfToken:web)은 isApp: false로 처리해야 함", () => {
      const csrfToken = "abc123def456789012345678901234ab";
      const state = `${csrfToken}:web`;
      const result = parseOAuthState(state);

      expect(result.csrfToken).toBe(csrfToken);
      expect(result.isApp).toBe(false);
    });

    it("createOAuthState와 parseOAuthState가 일관성 있게 동작해야 함", () => {
      // 웹 플로우
      const webResult = createOAuthState();
      const webParsed = parseOAuthState(webResult.state);
      expect(webParsed.csrfToken).toBe(webResult.csrfToken);
      expect(webParsed.isApp).toBe(false);

      // 앱 플로우
      const appResult = createOAuthState("app");
      const appParsed = parseOAuthState(appResult.state);
      expect(appParsed.csrfToken).toBe(appResult.csrfToken);
      expect(appParsed.isApp).toBe(true);
    });
  });
});
