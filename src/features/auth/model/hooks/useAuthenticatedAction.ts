import { useRouter } from "next/router";

import { useUserStore } from "@/entities/user/model/store";

import { useToastStore } from "@/widgets/Toast/model/store";

type UseAuthenticatedActionOptions = {
  notifyOnly?: boolean;
};

const useAuthenticatedAction = <TVariables, TOptions, TResult = void>(
  actionFn: (variables: TVariables, options?: TOptions) => TResult,
  hookOptions?: UseAuthenticatedActionOptions
) => {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const isAuthenticated = !!user;
  const router = useRouter();

  return (variables: TVariables, options?: TOptions): TResult | undefined => {
    if (!isAuthenticated) {
      if (hookOptions?.notifyOnly) {
        addToast({
          message: "로그인이 필요합니다.",
          variant: "default",
          position: "bottom",
        });
        return undefined;
      }

      router.replace({
        pathname: "/login",
        query: { redirectUrl: router.asPath },
      });

      return undefined;
    } else {
      return actionFn(variables, options);
    }
  };
};

export default useAuthenticatedAction;
