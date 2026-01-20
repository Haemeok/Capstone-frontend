import { postMessage } from "./client";

export type SharePayload = {
  title: string;
  text: string;
  url: string;
};

export const triggerNativeShare = (payload: SharePayload): void => {
  postMessage("SHARE", payload);
};
