type SentryUser = {
  id: string;
};

type ApiErrorTag = {
  "api.endpoint": string;
  "api.method": string;
  "api.error_code"?: string;
  "page.path": string;
};

export type { SentryUser, ApiErrorTag };
