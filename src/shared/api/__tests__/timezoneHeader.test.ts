import { apiClient } from "../client";
import { getClientTimeZone } from "../timezone";

jest.mock("../timezone", () => ({ getClientTimeZone: jest.fn() }));

const tzMock = getClientTimeZone as jest.Mock;

const okResponse = () => ({
  ok: true,
  status: 200,
  headers: { get: () => "application/json" },
  json: async () => ({}),
});

const getSentHeaders = (fetchMock: jest.Mock): Record<string, string> =>
  (fetchMock.mock.calls[0][1].headers ?? {}) as Record<string, string>;

describe("apiClient X-Timezone 주입", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    tzMock.mockReset();
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("T-201: 타임존이 있으면 X-Timezone 헤더를 붙인다", async () => {
    tzMock.mockReturnValue("America/New_York");
    const fetchMock = jest.fn().mockResolvedValue(okResponse());
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiClient("/x");

    expect(getSentHeaders(fetchMock)["X-Timezone"]).toBe("America/New_York");
  });

  it("T-202: 타임존이 undefined면(서버) 헤더를 붙이지 않는다", async () => {
    tzMock.mockReturnValue(undefined);
    const fetchMock = jest.fn().mockResolvedValue(okResponse());
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiClient("/x");

    expect("X-Timezone" in getSentHeaders(fetchMock)).toBe(false);
  });

  it("T-203: 호출자가 넘긴 X-Timezone이 우선한다", async () => {
    tzMock.mockReturnValue("America/New_York");
    const fetchMock = jest.fn().mockResolvedValue(okResponse());
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiClient("/x", { headers: { "X-Timezone": "Asia/Tokyo" } });

    expect(getSentHeaders(fetchMock)["X-Timezone"]).toBe("Asia/Tokyo");
  });
});
