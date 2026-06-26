"use client";

import { ReactNode } from "react";

import { useLocalizedRouter } from "@/shared/i18n";

import { useUserStore } from "@/entities/user/model/store";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";

type UseAuthenticatedActionOptions = {
  notifyOnly?: boolean;
  drawerIcon?: ReactNode;
  drawerMessage?: string;
};

const useAuthenticatedAction = <TVariables, TOptions, TResult = void>(
  actionFn: (variables: TVariables, options?: TOptions) => TResult,
  hookOptions?: UseAuthenticatedActionOptions
) => {
  const { user } = useUserStore();
  const { openDrawer } = useLoginEncourageDrawerStore();
  const router = useLocalizedRouter();

  return (variables: TVariables, options?: TOptions): TResult | undefined => {
    if (!user) {
      if (hookOptions?.notifyOnly) {
        openDrawer({
          icon: hookOptions.drawerIcon,
          message: hookOptions.drawerMessage,
        });
        return undefined;
      }

      router.replace(`/login?redirectUrl=${window.location.pathname}`);

      return undefined;
    } else {
      return actionFn(variables, options);
    }
  };
};

export default useAuthenticatedAction;
