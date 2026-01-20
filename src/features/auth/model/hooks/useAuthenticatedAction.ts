"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/entities/user/model/store";

import { useLoginEncourageDrawerStore } from "@/widgets/LoginEncourageDrawer/model/store";

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
  const router = useRouter();

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
