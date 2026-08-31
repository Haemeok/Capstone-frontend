import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import path from "node:path";
import { z } from "zod";

import { redactSensitive } from "./adsense-client";

export const ADSENSE_READONLY_SCOPE =
  "https://www.googleapis.com/auth/adsense.readonly";

type OAuthClient = {
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
};

type OAuthToken = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

type AuthorizationCallback = {
  redirectUri: string;
  waitForCode: () => Promise<string>;
  close: () => Promise<void>;
};

type ExchangeCodeInput = {
  client: OAuthClient;
  code: string;
  redirectUri: string;
};

export type AuthDependencies = {
  loadClient: () => Promise<OAuthClient>;
  createState: () => string;
  startCallback: (expectedState: string) => Promise<AuthorizationCallback>;
  exchangeCode: (input: ExchangeCodeInput) => Promise<OAuthToken>;
  saveToken: (token: OAuthToken) => Promise<void>;
  stdout: (message: string) => void;
  stderr: (message: string) => void;
};

type DefaultAuthDependencies = {
  credentialDirectory: string;
  fetch: typeof fetch;
};

const ClientSecretSchema = z.object({
  installed: z.object({
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    auth_uri: z.string().url(),
    token_uri: z.string().url(),
  }),
});

const TokenResponseSchema = z.object({
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  expires_in: z.number().int().optional(),
  scope: z.string().optional(),
  token_type: z.string().optional(),
});

const parseJson = (raw: string, label: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`${label} JSON 형식이 올바르지 않습니다`);
  }
};

const loadClient = async (
  credentialDirectory: string
): Promise<OAuthClient> => {
  const filePath = path.join(credentialDirectory, "client-secret.json");
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    throw new Error(
      `OAuth 데스크톱 클라이언트 파일이 없습니다: ${filePath.replaceAll("\\", "/")}`
    );
  }
  const result = ClientSecretSchema.safeParse(parseJson(raw, "OAuth client"));
  if (!result.success) {
    throw new Error("OAuth 데스크톱 클라이언트 JSON 형식이 올바르지 않습니다");
  }
  return {
    clientId: result.data.installed.client_id,
    clientSecret: result.data.installed.client_secret,
    authorizationEndpoint: result.data.installed.auth_uri,
    tokenEndpoint: result.data.installed.token_uri,
  };
};

export const buildAuthorizationUrl = (
  client: OAuthClient,
  redirectUri: string,
  state: string
): URL => {
  const url = new URL(client.authorizationEndpoint);
  url.search = new URLSearchParams({
    client_id: client.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: ADSENSE_READONLY_SCOPE,
    access_type: "offline",
    prompt: "select_account consent",
    state,
  }).toString();
  return url;
};

const sendCallbackResponse = (
  response: ServerResponse,
  status: number,
  message: string
): void => {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
};

const readAuthorizationCode = (
  request: IncomingMessage,
  expectedState: string
): string | undefined => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  if (url.pathname !== "/oauth2callback") return undefined;
  const error = url.searchParams.get("error");
  if (error !== null)
    throw new Error(`Google OAuth 승인이 거부되었습니다: ${error}`);
  if (url.searchParams.get("state") !== expectedState) {
    throw new Error("Google OAuth callback state가 일치하지 않습니다");
  }
  const code = url.searchParams.get("code");
  if (code === null || code === "") {
    throw new Error("Google OAuth callback에 authorization code가 없습니다");
  }
  return code;
};

type CallbackResult =
  | { status: "success"; code: string }
  | { status: "error"; error: unknown };

const handleCallbackRequest = (
  request: IncomingMessage,
  response: ServerResponse,
  expectedState: string,
  complete: (result: CallbackResult) => void
): void => {
  try {
    const code = readAuthorizationCode(request, expectedState);
    if (code === undefined) {
      sendCallbackResponse(response, 404, "Not found");
      return;
    }
    sendCallbackResponse(
      response,
      200,
      "인증되었습니다. 이 창을 닫으셔도 됩니다."
    );
    complete({ status: "success", code });
  } catch (error) {
    sendCallbackResponse(
      response,
      400,
      "인증에 실패했습니다. 터미널을 확인해 주세요."
    );
    complete({ status: "error", error });
  }
};

const waitForAuthorizationCode = (
  server: ReturnType<typeof createServer>,
  expectedState: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    const finish = (result: CallbackResult): void => {
      clearTimeout(timeout);
      server.removeListener("request", handleRequest);
      if (result.status === "success") resolve(result.code);
      else reject(result.error);
    };
    const handleRequest = (
      request: IncomingMessage,
      response: ServerResponse
    ): void => handleCallbackRequest(request, response, expectedState, finish);
    const timeout = setTimeout(() => {
      server.removeListener("request", handleRequest);
      reject(new Error("Google OAuth 승인이 5분 안에 완료되지 않았습니다"));
    }, 300_000);
    server.on("request", handleRequest);
  });

const closeServer = (server: ReturnType<typeof createServer>): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server.listening) {
      resolve();
      return;
    }
    server.close((error) => (error === undefined ? resolve() : reject(error)));
    server.closeAllConnections();
  });

const startCallback = async (
  expectedState: string
): Promise<AuthorizationCallback> => {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve();
    });
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    await closeServer(server);
    throw new Error("Google OAuth 로컬 callback 주소를 만들지 못했습니다");
  }
  return {
    redirectUri: `http://127.0.0.1:${address.port}/oauth2callback`,
    waitForCode: () => waitForAuthorizationCode(server, expectedState),
    close: () => closeServer(server),
  };
};

const readGoogleError = (data: unknown, status: number): string => {
  const result = z
    .object({
      error: z.string().optional(),
      error_description: z.string().optional(),
    })
    .safeParse(data);
  if (!result.success) return `Google OAuth token 요청 실패 (${status})`;
  return (
    result.data.error_description ??
    result.data.error ??
    `Google OAuth token 요청 실패 (${status})`
  );
};

const exchangeCode = async (
  input: ExchangeCodeInput,
  fetchImplementation: typeof fetch
): Promise<OAuthToken> => {
  const body = new URLSearchParams({
    code: input.code,
    client_id: input.client.clientId,
    client_secret: input.client.clientSecret,
    redirect_uri: input.redirectUri,
    grant_type: "authorization_code",
  });
  const response = await fetchImplementation(input.client.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const raw = await response.text();
  const data = parseJson(raw, "Google OAuth token 응답");
  if (!response.ok) throw new Error(readGoogleError(data, response.status));
  return TokenResponseSchema.parse(data);
};

const saveToken = async (
  credentialDirectory: string,
  token: OAuthToken
): Promise<void> => {
  await mkdir(credentialDirectory, { recursive: true });
  await writeFile(
    path.join(credentialDirectory, "token.json"),
    `${JSON.stringify(token, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
};

const authorize = async (
  client: OAuthClient,
  state: string,
  dependencies: AuthDependencies
): Promise<void> => {
  const callback = await dependencies.startCallback(state);
  try {
    const authorizationUrl = buildAuthorizationUrl(
      client,
      callback.redirectUri,
      state
    );
    dependencies.stdout(
      "아래 URL을 브라우저에서 열어 AdSense 읽기 권한을 승인해 주세요."
    );
    dependencies.stdout(authorizationUrl.toString());
    const code = await callback.waitForCode();
    const token = await dependencies.exchangeCode({
      client,
      code,
      redirectUri: callback.redirectUri,
    });
    if (token.refresh_token === undefined) {
      throw new Error("Google OAuth 응답에 refresh token이 없습니다");
    }
    await dependencies.saveToken(token);
  } finally {
    await callback.close();
  }
};

export const runAdsenseAuthCommand = async (
  dependencies: AuthDependencies
): Promise<number> => {
  try {
    const client = await dependencies.loadClient();
    await authorize(client, dependencies.createState(), dependencies);
    dependencies.stdout("AdSense 읽기 전용 인증 정보를 저장했습니다.");
    return 0;
  } catch (error) {
    dependencies.stderr(
      redactSensitive(error instanceof Error ? error.message : String(error))
    );
    return 1;
  }
};

export const createDefaultAuthDependencies = (
  {
    credentialDirectory,
    fetch: fetchImplementation,
  }: DefaultAuthDependencies = {
    credentialDirectory: ".adsense",
    fetch,
  }
): AuthDependencies => ({
  loadClient: () => loadClient(credentialDirectory),
  createState: () => randomBytes(32).toString("hex"),
  startCallback,
  exchangeCode: (input) => exchangeCode(input, fetchImplementation),
  saveToken: (token) => saveToken(credentialDirectory, token),
  stdout: console.log,
  stderr: console.error,
});
