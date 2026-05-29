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

  it("tips 모드는 tips 프롬프트로 생성한다", async () => {
    mockGenerate.mockResolvedValueOnce({ object: { topics: [] } });
    await POST(makeReq({ stage: "topics", modelId: "x", mode: "tips", seedKeyword: "수박" }));
    expect(mockGenerate.mock.calls[0][0].prompt).toContain("꿀팁");
  });

  it("게이트웨이 모델은 model을 string 그대로 넘긴다", async () => {
    mockGenerate.mockResolvedValueOnce({ object: { topics: [] } });
    await POST(makeReq({ stage: "topics", modelId: "deepseek/deepseek-v4-flash" }));
    expect(mockGenerate.mock.calls[0][0].model).toBe("deepseek/deepseek-v4-flash");
  });

  it("openai/ 모델은 OpenAI provider 인스턴스로 변환해 넘긴다 (string 아님)", async () => {
    mockGenerate.mockResolvedValueOnce({ object: { topics: [] } });
    await POST(makeReq({ stage: "topics", modelId: "openai/gpt-5.5" }));
    expect(typeof mockGenerate.mock.calls[0][0].model).not.toBe("string");
  });

  it("google/ 모델은 Gemini Studio provider 인스턴스로 변환해 넘긴다 (string 아님)", async () => {
    mockGenerate.mockResolvedValueOnce({ object: { topics: [] } });
    await POST(makeReq({ stage: "topics", modelId: "google/gemini-2.5-flash" }));
    expect(typeof mockGenerate.mock.calls[0][0].model).not.toBe("string");
  });
});
