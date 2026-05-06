/**
 * @jest-environment node
 */
import { checkAdminAccess } from "../index";

const cookiesMock = jest.fn();
jest.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const makeCookieStore = (accessToken: string | null, jar = "accessToken=t") => ({
  get: (key: string) =>
    key === "accessToken" && accessToken ? { value: accessToken } : undefined,
  toString: () => jar,
});

describe("checkAdminAccess", () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    fetchMock.mockReset();
    process.env.ADMIN_USER_ID = "ADMIN1";
  });

  it("returns 401 when no accessToken cookie", async () => {
    cookiesMock.mockResolvedValue(makeCookieStore(null));
    const result = await checkAdminAccess();
    expect(result).toEqual({ ok: false, status: 401, reason: "no-token" });
  });

  it("returns 401 when /api/me returns non-OK", async () => {
    cookiesMock.mockResolvedValue(makeCookieStore("t"));
    fetchMock.mockResolvedValue({ ok: false, status: 401 } as Response);
    const result = await checkAdminAccess();
    expect(result).toEqual({ ok: false, status: 401, reason: "upstream-401" });
  });

  it("returns 401 when /api/me throws", async () => {
    cookiesMock.mockResolvedValue(makeCookieStore("t"));
    fetchMock.mockRejectedValue(new Error("network"));
    const result = await checkAdminAccess();
    expect(result).toEqual({ ok: false, status: 401, reason: "fetch-failed" });
  });

  it("returns 403 when user.id mismatches ADMIN_USER_ID", async () => {
    cookiesMock.mockResolvedValue(makeCookieStore("t"));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "OTHER" }),
    } as Response);
    const result = await checkAdminAccess();
    expect(result).toEqual({ ok: false, status: 403, reason: "not-admin" });
  });

  it("returns ok=true when user.id matches", async () => {
    cookiesMock.mockResolvedValue(makeCookieStore("t"));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "ADMIN1" }),
    } as Response);
    const result = await checkAdminAccess();
    expect(result).toEqual({ ok: true });
  });

  it("returns 500 when ADMIN_USER_ID env is missing", async () => {
    delete process.env.ADMIN_USER_ID;
    cookiesMock.mockResolvedValue(makeCookieStore("t"));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "anyone" }),
    } as Response);
    const result = await checkAdminAccess();
    expect(result).toEqual({ ok: false, status: 500, reason: "env-missing" });
  });
});
