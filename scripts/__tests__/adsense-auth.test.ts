/** @jest-environment node */

import {
  ADSENSE_READONLY_SCOPE,
  type AuthDependencies,
  runAdsenseAuthCommand,
} from "../lib/adsense-auth";

test("T-01: read-only OAuth 승인 후 refresh token을 로컬에 저장합니다", async () => {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const savedTokens: unknown[] = [];
  const exchangedCodes: string[] = [];
  let receivedState = "";
  const dependencies: AuthDependencies = {
    loadClient: async () => ({
      clientId: "desktop-client-id",
      clientSecret: "desktop-client-secret",
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }),
    createState: () => "random-state",
    startCallback: async (expectedState) => {
      receivedState = expectedState;
      return {
        redirectUri: "http://127.0.0.1:54321/oauth2callback",
        waitForCode: async () => "authorization-code",
        close: async () => undefined,
      };
    },
    exchangeCode: async ({ code }) => {
      exchangedCodes.push(code);
      return {
        access_token: "access-token",
        refresh_token: "refresh-token",
        scope: ADSENSE_READONLY_SCOPE,
        token_type: "Bearer",
      };
    },
    saveToken: async (token) => {
      savedTokens.push(token);
    },
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  };

  await expect(runAdsenseAuthCommand(dependencies)).resolves.toBe(0);

  expect(receivedState).toBe("random-state");
  expect(exchangedCodes).toEqual(["authorization-code"]);
  expect(savedTokens).toEqual([
    expect.objectContaining({ refresh_token: "refresh-token" }),
  ]);
  const authorizationUrl = new URL(
    stdout.find((message) => message.startsWith("https://")) ?? ""
  );
  expect(authorizationUrl.searchParams.get("scope")).toBe(
    ADSENSE_READONLY_SCOPE
  );
  expect(authorizationUrl.searchParams.get("access_type")).toBe("offline");
  expect(authorizationUrl.searchParams.get("state")).toBe("random-state");
  expect(stderr).toEqual([]);
  expect(stdout.join("\n")).not.toContain("desktop-client-secret");
  expect(stdout.join("\n")).not.toContain("refresh-token");
});

test("T-01: refresh token이 없으면 인증 성공으로 처리하지 않습니다", async () => {
  const stderr: string[] = [];
  const dependencies: AuthDependencies = {
    loadClient: async () => ({
      clientId: "desktop-client-id",
      clientSecret: "desktop-client-secret",
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }),
    createState: () => "random-state",
    startCallback: async () => ({
      redirectUri: "http://127.0.0.1:54321/oauth2callback",
      waitForCode: async () => "authorization-code",
      close: async () => undefined,
    }),
    exchangeCode: async () => ({ access_token: "access-token" }),
    saveToken: async () => undefined,
    stdout: () => undefined,
    stderr: (message) => stderr.push(message),
  };

  await expect(runAdsenseAuthCommand(dependencies)).resolves.toBe(1);

  expect(stderr.join("\n")).toContain("refresh token");
  expect(stderr.join("\n")).not.toContain("desktop-client-secret");
});
