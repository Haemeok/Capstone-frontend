import type { useYoutubeImportStoreV2 } from "./store";
import { ActiveJob } from "./types";

type JobsState = { jobs: Record<string, ActiveJob> };
type StoreState = ReturnType<typeof useYoutubeImportStoreV2.getState>;

export const selectJobByUrl = (state: JobsState, url: string) =>
  Object.values(state.jobs).find((job) => job.url === url);

export const selectPendingJobs = (state: JobsState) =>
  Object.values(state.jobs).filter(
    (job) => job.state === "polling" || job.state === "creating"
  );

export const selectActiveJobCount = (state: JobsState) =>
  selectPendingJobs(state).length;

export const jobByUrlSelector =
  (url: string) =>
  (state: StoreState) =>
    selectJobByUrl(state, url);

export const pendingJobsSelector = (state: StoreState) =>
  selectPendingJobs(state);
