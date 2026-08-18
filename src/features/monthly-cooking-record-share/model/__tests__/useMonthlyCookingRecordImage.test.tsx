import { act, renderHook, waitFor } from "@testing-library/react";

import { createMonthlyCookingRecordImage } from "../../lib/createMonthlyCookingRecordImage";
import { useMonthlyCookingRecordImage } from "../useMonthlyCookingRecordImage";

jest.mock("../../lib/createMonthlyCookingRecordImage", () => ({
  createMonthlyCookingRecordImage: jest.fn(),
}));

const mockedCreateImage = jest.mocked(createMonthlyCookingRecordImage);

describe("useMonthlyCookingRecordImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("카드가 연결되면 PNG를 미리 만들고 준비 상태로 전환합니다", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    mockedCreateImage.mockResolvedValue(blob);
    const { result } = renderHook(() =>
      useMonthlyCookingRecordImage({
        enabled: true,
        generationKey: "2026-08:record-1",
      })
    );
    const node = document.createElement("div");

    act(() => result.current.captureRef(node));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.blob).toBe(blob);
    expect(mockedCreateImage).toHaveBeenCalledWith(node);
  });

  it("생성 실패 후 재시도하면 같은 카드에서 PNG를 다시 만듭니다", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    mockedCreateImage
      .mockRejectedValueOnce(new Error("capture failed"))
      .mockResolvedValueOnce(blob);
    const { result } = renderHook(() =>
      useMonthlyCookingRecordImage({
        enabled: true,
        generationKey: "2026-08:record-1",
      })
    );

    act(() => result.current.captureRef(document.createElement("div")));
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.blob).toBe(blob);
    expect(mockedCreateImage).toHaveBeenCalledTimes(2);
  });
});
