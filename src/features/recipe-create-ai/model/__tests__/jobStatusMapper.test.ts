import { fromAIJobStatusResponse } from "../jobStatusMapper";
import type { AIJobStatusResponse } from "../types";

describe("fromAIJobStatusResponse", () => {
  it("resultRecipeId가 있으면 status와 무관하게 completed를 반환한다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      resultRecipeId: "recipe-1",
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "completed",
      resultRecipeId: "recipe-1",
    });
  });

  it("status가 COMPLETED여도 resultRecipeId가 없으면 polling을 반환한다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "COMPLETED",
      progress: 90,
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 90,
    });
  });

  it("status가 FAILED면 code와 message를 그대로 실어 failed를 반환한다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "FAILED",
      code: "907",
      message: "지원하지 않는 URL 형식입니다.",
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "failed",
      code: "907",
      message: "지원하지 않는 URL 형식입니다.",
    });
  });

  it("FAILED인데 code가 없으면 code는 undefined로 둔다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "FAILED",
      message: "알 수 없는 오류가 발생했습니다.",
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "failed",
      code: undefined,
      message: "알 수 없는 오류가 발생했습니다.",
    });
  });

  it("FAILED인데 message가 비어 있으면 기본 실패 문구로 대체한다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "FAILED",
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "failed",
      code: undefined,
      message: "AI 레시피 생성에 실패했습니다.",
    });
  });

  it("IN_PROGRESS면 polling을 반환한다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      progress: 42,
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 42,
    });
  });

  it("PENDING이면 progress 기본값 0으로 polling을 반환한다", () => {
    const raw: AIJobStatusResponse = { jobId: "j1", status: "PENDING" };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 0,
    });
  });

  it("progress 0을 nullish로 취급하지 않고 보존한다", () => {
    const raw: AIJobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      progress: 0,
    };
    expect(fromAIJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 0,
    });
  });
});
