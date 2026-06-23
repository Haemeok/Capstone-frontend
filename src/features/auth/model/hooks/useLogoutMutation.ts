import { useMutation } from "@tanstack/react-query";

import {
  clearStoredLocale,
  useChromeLocale,
  useCommonDict,
} from "@/shared/i18n";
import { notifyAuthState } from "@/shared/lib/bridge/authStateBridge";
import { queryClient } from "@/shared/lib/queryClient";

import { useUserStore } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast";

import { postLogout } from "../api";
import { composeFailureToast } from "../lib/composeFailureToast";

const useLogoutMutation = () => {
  const { logoutAction } = useUserStore();
  const { addToast, removeToast } = useToastStore();
  const locale = useChromeLocale();
  const t = useCommonDict();

  const mutation = useMutation({
    mutationFn: postLogout,
    onMutate: () => {
      useUserStore.setState({ isLoggingOut: true });

      const deletingToastId = addToast({
        message: t.toast.logout.pending,
        variant: "default",
        size: "small",
        position: "middle",
        duration: 1000 * 1000,
      });

      return { deletingToastId };
    },
    onSuccess: () => {
      useUserStore.setState({ isLoggingOut: false });
      logoutAction();
      clearStoredLocale();
      notifyAuthState("logout");
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const userIdMatch = currentPath.match(/^\/users\/([^/]+)$/);

        if (userIdMatch) {
          window.location.replace("/users/guestUser");
        }
      }
    },
    onError: (error) => {
      addToast({
        message: composeFailureToast({
          template: t.toast.logout.error,
          locale,
          error,
          unknownText: t.errors.unknown,
        }),
        variant: "error",
        position: "middle",
      });
    },
    onSettled: (_, __, ___, context) => {
      if (context?.deletingToastId) {
        removeToast(context.deletingToastId);
      }
    },
  });

  return mutation;
};

export default useLogoutMutation;
