"use client";

import { type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { isAdReportPath } from "@/shared/config/privateRoutes";

const ServiceShell = dynamic(() => import("./ServiceShell"));

const DocumentTransition = () => {
  useEffect(() => {
    window.location.replace(window.location.href);
  }, []);
  return null;
};

export const RootShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isReport = isAdReportPath(pathname ?? "");
  const [startedAsReport] = useState(isReport);
  if (startedAsReport !== isReport) return <DocumentTransition />;
  return isReport ? children : <ServiceShell>{children}</ServiceShell>;
};
