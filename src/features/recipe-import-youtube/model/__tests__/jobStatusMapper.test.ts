import { fromJobStatusResponse } from "../jobStatusMapper";
import type { JobStatusResponse } from "../types";

describe("fromJobStatusResponse", () => {
  it("returns completed when resultRecipeId is present, regardless of status", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      resultRecipeId: "recipe-1",
    };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "completed",
      resultRecipeId: "recipe-1",
    });
  });

  it("returns completed when status is COMPLETED and resultRecipeId present", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "COMPLETED",
      resultRecipeId: "recipe-1",
    };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "completed",
      resultRecipeId: "recipe-1",
    });
  });

  it("returns polling when status is COMPLETED but resultRecipeId missing", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "COMPLETED",
      progress: 90,
    };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 90,
    });
  });

  it("returns failed when status is FAILED", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "FAILED",
      code: "907",
      message: "유튜브 링크만 가능해요",
    };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "failed",
      code: "907",
      message: "유튜브 링크만 가능해요",
    });
  });

  it("returns polling for IN_PROGRESS", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      progress: 42,
    };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 42,
    });
  });

  it("returns polling for PENDING with progress default 0", () => {
    const raw: JobStatusResponse = { jobId: "j1", status: "PENDING" };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 0,
    });
  });

  it("preserves progress 0 (does not treat as nullish)", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      progress: 0,
    };
    expect(fromJobStatusResponse(raw)).toEqual({
      state: "polling",
      progress: 0,
    });
  });
});
