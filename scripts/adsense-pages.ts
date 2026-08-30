import {
  type AdsenseReportResponse,
  mapPageReport,
  renderHumanPageReport,
  type ReportPeriod,
} from "./lib/adsense-report";

export type PagesDependencies = {
  getAccessToken: () => Promise<string>;
  listAccounts: (accessToken: string) => Promise<string[]>;
  generateReport: (
    accessToken: string,
    account: string,
    period: ReportPeriod
  ) => Promise<AdsenseReportResponse>;
  stdout: (message: string) => void;
  stderr: (message: string) => void;
};

const DEFAULT_PERIOD: ReportPeriod = {
  kind: "named",
  value: "LAST_30_DAYS",
};

export const runAdsensePagesCommand = async (
  _args: string[],
  dependencies: PagesDependencies
): Promise<number> => {
  try {
    const accessToken = await dependencies.getAccessToken();
    const accounts = await dependencies.listAccounts(accessToken);
    const account = accounts[0];
    if (account === undefined)
      throw new Error("No AdSense account is available");
    const response = await dependencies.generateReport(
      accessToken,
      account,
      DEFAULT_PERIOD
    );
    const report = mapPageReport(account, DEFAULT_PERIOD, response);
    dependencies.stdout(renderHumanPageReport(report));
    return 0;
  } catch (error) {
    dependencies.stderr(error instanceof Error ? error.message : String(error));
    return 1;
  }
};
