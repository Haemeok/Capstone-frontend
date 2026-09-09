"use client";

import { useState, useSyncExternalStore } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import { fetchAdReport } from "./reportApi";
import { ReportDashboard } from "./ReportDashboard";
import { createReportSession } from "./reportSession";
import { ReportStatus } from "./ReportStatus";
import styles from "./ReportView.module.css";

const ReportLoader = ({
  token,
  sessionId,
}: {
  token: string;
  sessionId: number;
}) => {
  const query = useQuery({
    queryKey: ["ad-report", sessionId, "initial"],
    queryFn: ({ signal }) => fetchAdReport(token, {}, signal),
    staleTime: Infinity,
  });
  if (!query.data || query.error)
    return (
      <ReportStatus error={query.error} onRetry={() => void query.refetch()} />
    );
  return (
    <ReportDashboard
      token={token}
      sessionId={sessionId}
      initialReport={query.data}
    />
  );
};

const ReportSession = () => {
  const [store] = useState(createReportSession);
  const session = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );
  if (!session) return <ReportStatus />;
  if (!session.token) return <ReportStatus missingLink />;
  return (
    <ReportLoader
      key={session.id}
      token={session.token}
      sessionId={session.id}
    />
  );
};

export const AdReportPageClient = ({ mock = false }: { mock?: boolean }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            gcTime: 0,
          },
        },
      })
  );
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>레시피오</span>
        <span>광고 성과 리포트</span>
      </header>
      <main className={styles.main}>
        <QueryClientProvider client={client}>
          {mock ? (
            <ReportLoader token="demo" sessionId={0} />
          ) : (
            <ReportSession />
          )}
        </QueryClientProvider>
      </main>
      <footer className={styles.footer}>레시피오 · 광고 성과 리포트</footer>
    </div>
  );
};
