import { useUserStore } from "./store";

export const useAuthGate = () =>
  useUserStore((state) => state.isAuthReady && state.isAuthenticated);
