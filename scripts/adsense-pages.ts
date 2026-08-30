import { redactSensitive } from "./lib/adsense-client";
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

const selectAccount = (accounts: string[], requested?: string): string => {
  if (accounts.length === 0) {
    throw new Error("조회 가능한 AdSense 계정이 없습니다");
  }
  if (requested === undefined && accounts.length > 1) {
    throw new Error(
      `여러 AdSense 계정이 있습니다. --account로 선택해 주세요:\n${accounts.join("\n")}`
    );
  }
  const account = requested ?? accounts[0];
  if (!accounts.includes(account)) {
    throw new Error(
      `접근할 수 없는 AdSense 계정입니다: ${account}\n${accounts.join("\n")}`
    );
  }
  return account;
};

const fetchPageReport = async (
  args: string[],
  dependencies: PagesDependencies
) => {
  const options = parsePagesArguments(args);
  const accessToken = await dependencies.getAccessToken();
  const accounts = await dependencies.listAccounts(accessToken);
  const account = selectAccount(accounts, options.account);
  const response = await dependencies.generateReport(
    accessToken,
    account,
    options.period
  );
  return { options, report: mapPageReport(account, options.period, response) };
};

export const runAdsensePagesCommand = async (
  args: string[],
  dependencies: PagesDependencies
): Promise<number> => {
  try {
    const { options, report } = await fetchPageReport(args, dependencies);
    dependencies.stdout(
      options.isJson
        ? renderJsonPageReport(report)
        : renderHumanPageReport(report)
    );
    if (report.isTruncated) {
      dependencies.stderr(
        "AdSense가 일부 page row만 반환했습니다. 완전한 합계가 아닙니다"
      );
      return 1;
    }
    return 0;
  } catch (error) {
    dependencies.stderr(
      redactSensitive(error instanceof Error ? error.message : String(error))
    );
    return 1;
  }
};
