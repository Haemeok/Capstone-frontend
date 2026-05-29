/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

jest.mock("@/shared/lib/admin-guard", () => ({
  assertAdminApi: jest.fn(),
}));
jest.mock("ai", () => ({
  generateObject: jest.fn(),
}));

import { generateObject } from "ai";

import { assertAdminApi } from "@/shared/lib/admin-guard";

import { POST } from "./route";

const mockGuard = assertAdminApi as jest.Mock;
const mockGenerate = generateObject as jest.Mock;

const makeReq = (body: unknown) =>
  new NextRequest("http://localhost/api/bff/admin/card-news-grid/content", {
    method: "POST",
    body: JSON.stringify(body),
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockGuard.mockResolvedValue(undefined);
});

describe("POST card-news-grid/content", () => {
  it("admin 가드가 응답을 주면 그대로 반환한다", async () => {
    const denied = new Response("nope", { status: 403 });
    mockGuard.mockResolvedValueOnce(denied);
    const res = await POST(makeReq({ stage: "topics", modelId: "x" }));
    expect(res.status).toBe(403);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("잘못된 stage는 400", async () => {
    const res = await POST(makeReq({ stage: "nope", modelId: "x" }));
    expect(res.status).toBe(400);
  });

  it("modelId 누락 시 400", async () => {
    const res = await POST(makeReq({ stage: "topics" }));
    expect(res.status).toBe(400);
  });

  it("topics 단계는 topics 객체를 반환한다", async () => {
    const topics = Array.from({ length: 5 }, () => ({ title: "t", concept: "c" }));
    mockGenerate.mockResolvedValueOnce({ object: { topics } });
    const res = await POST(makeReq({ stage: "topics", modelId: "deepseek/deepseek-v4-flash", seedKeyword: "케찹" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ topics });
  });

  it("items 단계는 header+items를 반환한다", async () => {
    const items = Array.from({ length: 9 }, () => ({ dishName: "d", caption: "c" }));
    mockGenerate.mockResolvedValueOnce({ object: { header: "h", items } });
    const res = await POST(makeReq({ stage: "items", modelId: "deepseek/deepseek-v4-flash", topicTitle: "황금비율" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ header: "h", items });
  });

  it("items 단계에서 topicTitle 누락 시 400", async () => {
    const res = await POST(makeReq({ stage: "items", modelId: "x" }));
    expect(res.status).toBe(400);
  });

  it("generateObject가 throw하면 502", async () => {
    mockGenerate.mockRejectedValueOnce(new Error("gateway down"));
    const res = await POST(makeReq({ stage: "topics", modelId: "x" }));
    expect(res.status).toBe(502);
  });
});
