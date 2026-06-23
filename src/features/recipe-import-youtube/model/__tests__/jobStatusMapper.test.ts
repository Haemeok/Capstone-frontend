import { youtubeMessages } from "@/shared/i18n";

import { fromJobStatusResponse } from "../jobStatusMapper";
import type { JobStatusResponse } from "../types";

const ko = youtubeMessages.ko;

describe("fromJobStatusResponse", () => {
  it("resultRecipeId가 있으면 status와 무관하게 completed를 반환한다", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      resultRecipeId: "recipe-1",
    };
    expect(fromJobStatusResponse(raw, ko)).toEqual({
      state: "completed",
      resultRecipeId: "recipe-1",
    });
  });

  it("status가 COMPLETED이고 resultRecipeId가 있으면 completed를 반환한다", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "COMPLETED",
      resultRecipeId: "recipe-1",
    };
    expect(fromJobStatusResponse(raw, ko)).toEqual({
      state: "completed",
      resultRecipeId: "recipe-1",
    });
  });

  it("status가 COMPLETED여도 resultRecipeId가 없으면 polling을 반환한다", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "COMPLETED",
      progress: 90,
    };
    expect(fromJobStatusResponse(raw, ko)).toEqual({
      state: "polling",
      progress: 90,
    });
  });

  it.each(["ko", "en", "ja"] as const)(
    "status가 FAILED면 dict[%s]로 로컬라이즈된 failed를 반환한다",
    (loc) => {
      const raw: JobStatusResponse = {
        jobId: "j1",
        status: "FAILED",
        code: "907",
      };
      expect(fromJobStatusResponse(raw, youtubeMessages[loc])).toEqual({
        state: "failed",
        code: "907",
        message: youtubeMessages[loc].errorUnsupportedUrl,
      });
    }
  );

  it("IN_PROGRESS면 polling을 반환한다", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      progress: 42,
    };
    expect(fromJobStatusResponse(raw, ko)).toEqual({
      state: "polling",
      progress: 42,
    });
  });

  it("PENDING이면 progress 기본값 0으로 polling을 반환한다", () => {
    const raw: JobStatusResponse = { jobId: "j1", status: "PENDING" };
    expect(fromJobStatusResponse(raw, ko)).toEqual({
      state: "polling",
      progress: 0,
    });
  });

  it("progress 0을 nullish로 취급하지 않고 보존한다", () => {
    const raw: JobStatusResponse = {
      jobId: "j1",
      status: "IN_PROGRESS",
      progress: 0,
    };
    expect(fromJobStatusResponse(raw, ko)).toEqual({
      state: "polling",
      progress: 0,
    });
  });
});
