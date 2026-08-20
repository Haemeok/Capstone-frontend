import { act, renderHook } from "@testing-library/react";

import { useImageGeneration } from "./useImageGeneration";

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

describe("video studio image BFF routing", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        images: ["data:image/png;base64,image"],
        modelId: "gpt-image-1",
        pricePerImage: 0.01,
        latencyMs: 100,
      }),
    });
  });

  it("T-04: Admin 이미지 생성은 운영 API base 대신 same-origin BFF를 호출한다", async () => {
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      await result.current.run({
        modelId: "gpt-image-1",
        prompt: "recipe image",
        n: 1,
      });
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "/api/bff/admin/video-studio/image"
    );
  });
});
