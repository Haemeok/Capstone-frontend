import {
  type AdsenseReportResponse,
  mapPageReport,
  parsePagesArguments,
  renderHumanPageReport,
  renderJsonPageReport,
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

export const runAdsensePagesCommand = async (
  args: string[],
  dependencies: PagesDependencies
): Promise<number> => {
  try {
    const options = parsePagesArguments(args);
    const accessToken = await dependencies.getAccessToken();
    const accounts = await dependencies.listAccounts(accessToken);
    const account = accounts[0];
    if (account === undefined)
      throw new Error("No AdSense account is available");
    const response = await dependencies.generateReport(
      accessToken,
      account,
      options.period
    );
    const report = mapPageReport(account, options.period, response);
    dependencies.stdout(
      options.isJson
        ? renderJsonPageReport(report)
        : renderHumanPageReport(report)
    );
    return 0;
  } catch (error) {
    dependencies.stderr(error instanceof Error ? error.message : String(error));
    return 1;
  }
};
