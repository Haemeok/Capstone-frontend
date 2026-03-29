export type CheckStatus = "pass" | "fail" | "warn";

export type CheckResult = {
  name: string;
  status: CheckStatus;
  message: string;
  details?: string;
};

export type Tier = "daily" | "deep";
