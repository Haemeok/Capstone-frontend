export const isAdReportPath = (pathname: string) =>
  /^\/ad-report\/?$/.test(pathname);

export const isPrivateReportDocument = () =>
  typeof window !== "undefined" && isAdReportPath(window.location.pathname);
