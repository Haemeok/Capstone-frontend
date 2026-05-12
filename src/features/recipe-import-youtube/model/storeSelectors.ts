import { ActiveJob } from "./types";

type JobsState = { jobs: Record<string, ActiveJob> };

export const selectJobByUrl = (state: JobsState, url: string) =>
  Object.values(state.jobs).find((job) => job.url === url);

export const selectPendingJobs = (state: JobsState) =>
  Object.values(state.jobs).filter(
    (job) => job.state === "polling" || job.state === "creating"
  );

export const selectActiveJobCount = (state: JobsState) =>
  selectPendingJobs(state).length;
