import { postMessage } from "./client";

export const requestAppReview = (): void => {
  postMessage("REQUEST_REVIEW");
};
