import type { Metadata } from "next";

import { AdReportPageClient } from "./_components/AdReportPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "광고 성과 리포트 | 레시피오",
  description: "광고 캠페인의 성과를 확인하세요.",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

const AdReportPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ mock?: string }>;
}) => {
  const params = await searchParams;
  return <AdReportPageClient mock={params.mock === "1"} />;
};

export default AdReportPage;
