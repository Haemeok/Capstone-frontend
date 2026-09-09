type ReportSession = { token: string | null; id: number };

export const createReportSession = () => {
  let snapshot: ReportSession | null = null;
  let id = 0;
  const listeners = new Set<() => void>();
  const initialize = () => {
    const fragment = window.location.hash;
    if (snapshot && !fragment) return;
    const values = new URLSearchParams(fragment.slice(1)).getAll("token");
    const token =
      values.length === 1 && /^[A-Za-z0-9_-]{43}$/.test(values[0])
        ? values[0]
        : null;
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search
    );
    snapshot = { token, id: ++id };
    listeners.forEach((listener) => listener());
  };
  return {
    initialize,
    getSnapshot: () => snapshot,
    getServerSnapshot: (): ReportSession | null => null,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      window.addEventListener("hashchange", initialize);
      initialize();
      return () => {
        listeners.delete(listener);
        window.removeEventListener("hashchange", initialize);
      };
    },
  };
};
