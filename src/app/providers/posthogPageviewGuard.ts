let lastCapturedUrl: string | null = null;

export const shouldCapturePageview = (url: string): boolean => {
  if (lastCapturedUrl === url) return false;
  lastCapturedUrl = url;
  return true;
};

export const __resetPageviewGuard = (): void => {
  lastCapturedUrl = null;
};
